PRAGMA foreign_keys = ON;

DELETE FROM contribution_events;
DELETE FROM participants;

INSERT INTO participants (
  device_id,
  display_name,
  contributions,
  last_contribution_at_ms,
  created_at,
  updated_at
) VALUES
  ('00000001-0000-4000-8000-000000000001', 'az0927', 3, 0, datetime('now', '-11 minutes'), datetime('now', '-11 minutes')),
  ('00000002-0000-4000-8000-000000000002', '阿哲', 3, 0, datetime('now', '-10 minutes'), datetime('now', '-10 minutes')),
  ('00000003-0000-4000-8000-000000000003', 'k3vin77', 3, 0, datetime('now', '-9 minutes'), datetime('now', '-9 minutes')),
  ('00000004-0000-4000-8000-000000000004', 'M1KA', 2, 0, datetime('now', '-8 minutes'), datetime('now', '-8 minutes')),
  ('00000005-0000-4000-8000-000000000005', '小安', 2, 0, datetime('now', '-7 minutes'), datetime('now', '-7 minutes')),
  ('00000006-0000-4000-8000-000000000006', 'asdfgh', 2, 0, datetime('now', '-6 minutes'), datetime('now', '-6 minutes')),
  ('00000007-0000-4000-8000-000000000007', '路過一下', 2, 0, datetime('now', '-5 minutes'), datetime('now', '-5 minutes')),
  ('00000008-0000-4000-8000-000000000008', '404qq', 1, 0, datetime('now', '-4 minutes'), datetime('now', '-4 minutes')),
  ('00000009-0000-4000-8000-000000000009', 'yuna00', 1, 0, datetime('now', '-3 minutes'), datetime('now', '-3 minutes')),
  ('00000010-0000-4000-8000-000000000010', '不想取名', 1, 0, datetime('now', '-2 minutes'), datetime('now', '-2 minutes')),
  ('00000011-0000-4000-8000-000000000011', '7seven', 1, 0, datetime('now', '-1 minute'), datetime('now', '-1 minute'));

UPDATE global_stats
SET total_views = (SELECT COALESCE(SUM(contributions), 0) FROM participants),
    updated_at = CURRENT_TIMESTAMP
WHERE id = 1;
