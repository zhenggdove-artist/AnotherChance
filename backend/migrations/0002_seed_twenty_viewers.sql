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
  ('00000001-0000-4000-8000-000000000001', '夜行者', 13, 0, datetime('now', '-20 minutes'), datetime('now', '-20 minutes')),
  ('00000002-0000-4000-8000-000000000002', '小雨', 11, 0, datetime('now', '-19 minutes'), datetime('now', '-19 minutes')),
  ('00000003-0000-4000-8000-000000000003', '無名祈願者', 10, 0, datetime('now', '-18 minutes'), datetime('now', '-18 minutes')),
  ('00000004-0000-4000-8000-000000000004', '阿明', 9, 0, datetime('now', '-17 minutes'), datetime('now', '-17 minutes')),
  ('00000005-0000-4000-8000-000000000005', '黃光之下', 8, 0, datetime('now', '-16 minutes'), datetime('now', '-16 minutes')),
  ('00000006-0000-4000-8000-000000000006', '凌晨三點', 8, 0, datetime('now', '-15 minutes'), datetime('now', '-15 minutes')),
  ('00000007-0000-4000-8000-000000000007', '等待神蹟', 7, 0, datetime('now', '-14 minutes'), datetime('now', '-14 minutes')),
  ('00000008-0000-4000-8000-000000000008', '再看一次', 7, 0, datetime('now', '-13 minutes'), datetime('now', '-13 minutes')),
  ('00000009-0000-4000-8000-000000000009', '小林', 6, 0, datetime('now', '-12 minutes'), datetime('now', '-12 minutes')),
  ('00000010-0000-4000-8000-000000000010', '倒數三十秒', 6, 0, datetime('now', '-11 minutes'), datetime('now', '-11 minutes')),
  ('00000011-0000-4000-8000-000000000011', '海邊的風', 5, 0, datetime('now', '-10 minutes'), datetime('now', '-10 minutes')),
  ('00000012-0000-4000-8000-000000000012', '白日夢', 5, 0, datetime('now', '-9 minutes'), datetime('now', '-9 minutes')),
  ('00000013-0000-4000-8000-000000000013', '第七位見證者', 5, 0, datetime('now', '-8 minutes'), datetime('now', '-8 minutes')),
  ('00000014-0000-4000-8000-000000000014', '安安', 4, 0, datetime('now', '-7 minutes'), datetime('now', '-7 minutes')),
  ('00000015-0000-4000-8000-000000000015', '木木', 4, 0, datetime('now', '-6 minutes'), datetime('now', '-6 minutes')),
  ('00000016-0000-4000-8000-000000000016', '遠方的人', 4, 0, datetime('now', '-5 minutes'), datetime('now', '-5 minutes')),
  ('00000017-0000-4000-8000-000000000017', '尚未復活', 3, 0, datetime('now', '-4 minutes'), datetime('now', '-4 minutes')),
  ('00000018-0000-4000-8000-000000000018', '一束微光', 3, 0, datetime('now', '-3 minutes'), datetime('now', '-3 minutes')),
  ('00000019-0000-4000-8000-000000000019', '路過的信徒', 2, 0, datetime('now', '-2 minutes'), datetime('now', '-2 minutes')),
  ('00000020-0000-4000-8000-000000000020', '最後一次', 1, 0, datetime('now', '-1 minute'), datetime('now', '-1 minute'));

UPDATE global_stats
SET total_views = 121,
    updated_at = CURRENT_TIMESTAMP
WHERE id = 1;
