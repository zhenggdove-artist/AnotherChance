PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS global_stats (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  total_views INTEGER NOT NULL CHECK (total_views >= 0),
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT OR IGNORE INTO global_stats (id, total_views) VALUES (1, 751);

CREATE TABLE IF NOT EXISTS participants (
  device_id TEXT PRIMARY KEY,
  display_name TEXT,
  contributions INTEGER NOT NULL DEFAULT 0 CHECK (contributions >= 0),
  last_contribution_at_ms INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_participants_display_name
  ON participants(display_name COLLATE NOCASE)
  WHERE display_name IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_participants_leaderboard
  ON participants(contributions DESC, updated_at ASC)
  WHERE display_name IS NOT NULL;

CREATE TABLE IF NOT EXISTS contribution_events (
  event_id TEXT PRIMARY KEY,
  device_id TEXT NOT NULL,
  created_at_ms INTEGER NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_contribution_events_device
  ON contribution_events(device_id, created_at_ms DESC);

CREATE TRIGGER IF NOT EXISTS contribution_cooldown
BEFORE INSERT ON contribution_events
WHEN EXISTS (
  SELECT 1
  FROM participants
  WHERE device_id = NEW.device_id
    AND last_contribution_at_ms > NEW.created_at_ms - 27000
)
BEGIN
  SELECT RAISE(ABORT, 'contribution_cooldown');
END;

CREATE TRIGGER IF NOT EXISTS contribution_applied
AFTER INSERT ON contribution_events
BEGIN
  INSERT INTO participants (
    device_id,
    contributions,
    last_contribution_at_ms,
    updated_at
  ) VALUES (
    NEW.device_id,
    1,
    NEW.created_at_ms,
    CURRENT_TIMESTAMP
  )
  ON CONFLICT(device_id) DO UPDATE SET
    contributions = participants.contributions + 1,
    last_contribution_at_ms = NEW.created_at_ms,
    updated_at = CURRENT_TIMESTAMP;

  UPDATE global_stats
  SET total_views = total_views + 1,
      updated_at = CURRENT_TIMESTAMP
  WHERE id = 1;
END;
