-- Silvana Ferri: D1 (SQLite)
CREATE TABLE IF NOT EXISTS admins (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS sessions (
  token_hash TEXT PRIMARY KEY,
  admin_id INTEGER NOT NULL REFERENCES admins(id) ON DELETE CASCADE,
  expires_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS leads (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL CHECK (length(name) BETWEEN 2 AND 80),
  phone TEXT NOT NULL CHECK (length(phone) BETWEEN 8 AND 20),
  subject TEXT NOT NULL CHECK (subject IN ('casamento','quinze_anos','outros','duvidas')),
  event_date TEXT,
  message TEXT CHECK (message IS NULL OR length(message) <= 600),
  status TEXT NOT NULL DEFAULT 'novo' CHECK (status IN ('novo','em_conversa','orcamento_enviado','fechado','perdido')),
  quote_value REAL CHECK (quote_value IS NULL OR quote_value >= 0),
  notes TEXT CHECK (notes IS NULL OR length(notes) <= 2000),
  source TEXT NOT NULL DEFAULT 'site',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS leads_subject_status_idx ON leads (subject, status, created_at DESC);

CREATE TABLE IF NOT EXISTS rate_limits (
  key TEXT NOT NULL,
  at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS rate_limits_key_idx ON rate_limits (key, at);
