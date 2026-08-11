const DEVICE_ID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const MAX_NAME_LENGTH = 20;

function isAllowedOrigin(origin, env) {
  if (!origin) return true;
  if (origin === env.SITE_ORIGIN) return true;
  return /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);
}

function corsHeaders(request, env) {
  const origin = request.headers.get("Origin");
  const allowedOrigin = origin && isAllowedOrigin(origin, env) ? origin : env.SITE_ORIGIN;
  return {
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Max-Age": "86400",
    "Cache-Control": "no-store",
    "Content-Type": "application/json; charset=utf-8",
    "Vary": "Origin"
  };
}

function json(request, env, data, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders(request, env), ...extraHeaders }
  });
}

function validDeviceId(value) {
  return typeof value === "string" && DEVICE_ID_PATTERN.test(value);
}

function normalizeName(value) {
  if (typeof value !== "string") return null;
  const normalized = value.normalize("NFKC").replace(/\s+/g, " ").trim();
  const length = Array.from(normalized).length;
  if (length < 1 || length > MAX_NAME_LENGTH) return null;
  if (/[\u0000-\u001f\u007f]/.test(normalized)) return null;
  return normalized;
}

async function parseBody(request) {
  const contentType = request.headers.get("Content-Type") || "";
  if (!contentType.toLowerCase().includes("application/json")) return null;
  try {
    return await request.json();
  } catch {
    return null;
  }
}

async function readState(env, deviceId = null) {
  const statements = [
    env.DB.prepare("SELECT total_views, updated_at FROM global_stats WHERE id = 1")
  ];

  if (validDeviceId(deviceId)) {
    statements.push(
      env.DB.prepare(
        "SELECT display_name, contributions FROM participants WHERE device_id = ?"
      ).bind(deviceId)
    );
  }

  const results = await env.DB.batch(statements);
  const global = results[0]?.results?.[0];
  if (!global) throw new Error("global_stats_missing");
  const profile = results[1]?.results?.[0] || null;
  return {
    totalViews: Number(global.total_views),
    updatedAt: global.updated_at,
    profile: profile
      ? {
          name: profile.display_name || null,
          contributions: Number(profile.contributions)
        }
      : { name: null, contributions: 0 }
  };
}

async function getLeaderboard(request, env) {
  const [stateResult, leaderboardResult] = await env.DB.batch([
    env.DB.prepare("SELECT total_views, updated_at FROM global_stats WHERE id = 1"),
    env.DB.prepare(
      `SELECT display_name, contributions
       FROM participants
       WHERE display_name IS NOT NULL
       ORDER BY contributions DESC, updated_at ASC, display_name COLLATE NOCASE ASC
       LIMIT 50`
    )
  ]);

  const global = stateResult.results?.[0];
  if (!global) throw new Error("global_stats_missing");
  const leaderboard = (leaderboardResult.results || []).map((row, index) => ({
    rank: index + 1,
    name: row.display_name,
    contributions: Number(row.contributions)
  }));

  return json(request, env, {
    totalViews: Number(global.total_views),
    updatedAt: global.updated_at,
    leaderboard
  });
}

async function saveProfile(request, env) {
  const body = await parseBody(request);
  const deviceId = body?.deviceId;
  const name = normalizeName(body?.name);

  if (!validDeviceId(deviceId)) {
    return json(request, env, { error: "invalid_device" }, 400);
  }
  if (!name) {
    return json(request, env, { error: "invalid_name", maxLength: MAX_NAME_LENGTH }, 400);
  }

  try {
    await env.DB.prepare(
      `INSERT INTO participants (device_id, display_name, updated_at)
       VALUES (?, ?, CURRENT_TIMESTAMP)
       ON CONFLICT(device_id) DO UPDATE SET
         display_name = excluded.display_name,
         updated_at = CURRENT_TIMESTAMP`
    ).bind(deviceId, name).run();
  } catch (error) {
    if (String(error?.message || error).includes("UNIQUE constraint failed")) {
      return json(request, env, { error: "name_taken" }, 409);
    }
    throw error;
  }

  return json(request, env, await readState(env, deviceId));
}

async function contribute(request, env) {
  const body = await parseBody(request);
  const deviceId = body?.deviceId;
  const eventId = body?.eventId;

  if (!validDeviceId(deviceId) || !validDeviceId(eventId)) {
    return json(request, env, { error: "invalid_contribution" }, 400);
  }

  const existing = await env.DB.prepare(
    "SELECT event_id FROM contribution_events WHERE event_id = ?"
  ).bind(eventId).first();
  if (existing) {
    return json(request, env, { accepted: true, duplicate: true, ...(await readState(env, deviceId)) });
  }

  const rateLimit = await env.CONTRIBUTION_RATE_LIMITER.limit({ key: deviceId });
  if (!rateLimit.success) {
    return json(request, env, { error: "rate_limited", retryAfter: 30 }, 429, {
      "Retry-After": "30"
    });
  }

  try {
    await env.DB.prepare(
      "INSERT INTO contribution_events (event_id, device_id, created_at_ms) VALUES (?, ?, ?)"
    ).bind(eventId, deviceId, Date.now()).run();
  } catch (error) {
    const message = String(error?.message || error);
    if (message.includes("contribution_cooldown")) {
      return json(request, env, { error: "contribution_cooldown", retryAfter: 30 }, 429, {
        "Retry-After": "30"
      });
    }
    if (!message.includes("UNIQUE constraint failed")) throw error;
  }

  return json(request, env, { accepted: true, ...(await readState(env, deviceId)) });
}

export default {
  async fetch(request, env) {
    if (!isAllowedOrigin(request.headers.get("Origin"), env)) {
      return json(request, env, { error: "origin_not_allowed" }, 403);
    }

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders(request, env) });
    }

    const url = new URL(request.url);

    try {
      if (request.method === "GET" && url.pathname === "/api/health") {
        return json(request, env, { ok: true });
      }
      if (request.method === "GET" && url.pathname === "/api/state") {
        return json(request, env, await readState(env, url.searchParams.get("deviceId")));
      }
      if (request.method === "GET" && url.pathname === "/api/leaderboard") {
        return getLeaderboard(request, env);
      }
      if (request.method === "POST" && url.pathname === "/api/profile") {
        return saveProfile(request, env);
      }
      if (request.method === "POST" && url.pathname === "/api/contribute") {
        return contribute(request, env);
      }
      return json(request, env, { error: "not_found" }, 404);
    } catch (error) {
      console.error("API error", error);
      return json(request, env, { error: "database_unavailable" }, 503);
    }
  }
};
