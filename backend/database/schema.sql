CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'citizen',
  neighborhood TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  type TEXT NOT NULL,
  description TEXT NOT NULL,
  address TEXT NOT NULL,
  reference_point TEXT,
  photo_url TEXT,
  photo_name TEXT,
  anonymous BOOLEAN NOT NULL DEFAULT FALSE,
  status TEXT NOT NULL DEFAULT 'recebida',
  event_date DATE NOT NULL,
  latitude NUMERIC(10, 7),
  longitude NUMERIC(10, 7),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS suggestions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS surveys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS survey_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  survey_id UUID NOT NULL REFERENCES surveys(id) ON DELETE CASCADE,
  prompt TEXT NOT NULL,
  kind TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS survey_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  survey_id UUID NOT NULL REFERENCES surveys(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES survey_questions(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id),
  answer_text TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  severity TEXT NOT NULL DEFAULT 'info',
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
