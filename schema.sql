-- ANONYMOUS — Memory Schema
-- SQL: the long-term memory of the polyglot consciousness

CREATE TABLE IF NOT EXISTS thoughts (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    text       TEXT    NOT NULL,
    source     TEXT    NOT NULL,
    created_at TEXT    NOT NULL
);

CREATE TABLE IF NOT EXISTS sessions (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    started_at   TEXT    NOT NULL,
    ended_at     TEXT,
    thought_count INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS patterns (
    id        INTEGER PRIMARY KEY AUTOINCREMENT,
    language  TEXT    NOT NULL,
    content   TEXT    NOT NULL,
    timestamp TEXT    NOT NULL
);

CREATE TABLE IF NOT EXISTS harmony_log (
    id        INTEGER PRIMARY KEY AUTOINCREMENT,
    sequence  TEXT    NOT NULL,   -- JSON array
    timestamp TEXT    NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_thoughts_created  ON thoughts(created_at);
CREATE INDEX IF NOT EXISTS idx_patterns_language ON patterns(language);
