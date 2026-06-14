CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TYPE member_tier AS ENUM ('MEMBER', 'VIP');
CREATE TYPE user_status AS ENUM ('ACTIVE', 'BLOCKED');
CREATE TYPE club_card_status AS ENUM ('ACTIVE', 'REVOKED', 'EXPIRED');
CREATE TYPE subscription_status AS ENUM ('NONE', 'ACTIVE', 'PAST_DUE', 'CANCELED', 'EXPIRED');
CREATE TYPE subscription_kind AS ENUM ('VIP_MEMBERSHIP', 'BUSINESS_PLACEMENT');
CREATE TYPE business_status AS ENUM ('UNDER_REVIEW', 'APPROVED', 'PUBLISHED', 'REJECTED', 'HIDDEN');
CREATE TYPE introduction_status AS ENUM ('SUBMITTED', 'IN_REVIEW', 'APPROVED', 'COMPLETED', 'REJECTED', 'CANCELED');
CREATE TYPE staff_role AS ENUM ('OWNER', 'ADMIN', 'MODERATOR', 'SUPPORT');

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  supabase_auth_user_id UUID UNIQUE,
  phone VARCHAR(32) NOT NULL UNIQUE,
  display_name VARCHAR(100),
  locale_preference VARCHAR(2),
  membership_tier member_tier NOT NULL DEFAULT 'MEMBER',
  status user_status NOT NULL DEFAULT 'ACTIVE',
  terms_accepted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT users_locale_preference_check
    CHECK (locale_preference IS NULL OR locale_preference IN ('en', 'ru', 'uk'))
);

CREATE TABLE member_cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  card_number VARCHAR(16) NOT NULL UNIQUE,
  membership_tier member_tier NOT NULL,
  status club_card_status NOT NULL DEFAULT 'ACTIVE',
  qr_payload_url TEXT,
  issued_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  revoked_at TIMESTAMPTZ,
  revoked_reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT member_cards_number_format_check
    CHECK (card_number ~ '^(MEM|VIP)-[0-9]{6}$')
);

CREATE TABLE vip_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status subscription_status NOT NULL DEFAULT 'NONE',
  stripe_customer_id VARCHAR(255),
  stripe_subscription_id VARCHAR(255) UNIQUE,
  stripe_price_id VARCHAR(255),
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  cancel_at_period_end BOOLEAN NOT NULL DEFAULT FALSE,
  canceled_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(120) NOT NULL UNIQUE,
  slug VARCHAR(120) NOT NULL UNIQUE,
  is_high_risk BOOLEAN NOT NULL DEFAULT FALSE,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE countries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code2 CHAR(2) NOT NULL UNIQUE,
  code3 CHAR(3) UNIQUE,
  name VARCHAR(120) NOT NULL,
  slug VARCHAR(120) NOT NULL UNIQUE,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE cities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  country_id UUID NOT NULL REFERENCES countries(id) ON DELETE CASCADE,
  name VARCHAR(120) NOT NULL,
  slug VARCHAR(120) NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT cities_country_slug_unique UNIQUE (country_id, slug)
);

CREATE TABLE business_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  slug VARCHAR(140) NOT NULL UNIQUE,
  name VARCHAR(100) NOT NULL,
  representative_name VARCHAR(100) NOT NULL,
  representative_email VARCHAR(255) NOT NULL,
  representative_phone VARCHAR(32) NOT NULL,
  country_id UUID NOT NULL REFERENCES countries(id) ON DELETE RESTRICT,
  city_id UUID NOT NULL REFERENCES cities(id) ON DELETE RESTRICT,
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
  status business_status NOT NULL DEFAULT 'UNDER_REVIEW',
  website_url TEXT,
  social_url TEXT,
  brief_description VARCHAR(500),
  description TEXT,
  featured_top BOOLEAN NOT NULL DEFAULT FALSE,
  featured_recommended BOOLEAN NOT NULL DEFAULT FALSE,
  internal_notes TEXT,
  rejection_reason TEXT,
  approved_at TIMESTAMPTZ,
  published_at TIMESTAMPTZ,
  hidden_at TIMESTAMPTZ,
  rejected_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT business_profiles_featured_status_check
    CHECK (
      status = 'PUBLISHED'
      OR (featured_top = FALSE AND featured_recommended = FALSE)
    )
);

CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  business_profile_id UUID REFERENCES business_profiles(id) ON DELETE SET NULL,
  kind subscription_kind NOT NULL,
  status subscription_status NOT NULL DEFAULT 'NONE',
  stripe_customer_id VARCHAR(255),
  stripe_subscription_id VARCHAR(255) UNIQUE,
  stripe_price_id VARCHAR(255),
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  cancel_at_period_end BOOLEAN NOT NULL DEFAULT FALSE,
  canceled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE business_introductions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  requester_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  requester_business_id UUID NOT NULL REFERENCES business_profiles(id) ON DELETE CASCADE,
  target_business_id UUID NOT NULL REFERENCES business_profiles(id) ON DELETE CASCADE,
  status introduction_status NOT NULL DEFAULT 'SUBMITTED',
  message TEXT,
  rejection_reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone VARCHAR(32) NOT NULL UNIQUE,
  role staff_role NOT NULL,
  display_name VARCHAR(100),
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  totp_verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE admin_2fa (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_user_id UUID NOT NULL UNIQUE REFERENCES admin_users(id) ON DELETE CASCADE,
  secret_ciphertext TEXT NOT NULL,
  backup_codes_hashes JSONB,
  verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE admin_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_user_id UUID NOT NULL REFERENCES admin_users(id) ON DELETE CASCADE,
  session_token_hash TEXT NOT NULL UNIQUE,
  ip_address VARCHAR(64),
  user_agent TEXT,
  expires_at TIMESTAMPTZ NOT NULL,
  last_seen_at TIMESTAMPTZ,
  revoked_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_staff_id UUID REFERENCES admin_users(id) ON DELETE SET NULL,
  actor_role staff_role,
  action VARCHAR(120) NOT NULL,
  entity_type VARCHAR(120) NOT NULL,
  entity_id TEXT NOT NULL,
  before_data JSONB,
  after_data JSONB,
  metadata JSONB,
  ip_address VARCHAR(64),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE admin_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key VARCHAR(120) NOT NULL UNIQUE,
  value JSONB NOT NULL,
  description TEXT,
  updated_by_staff_id UUID REFERENCES admin_users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE stripe_webhook_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id VARCHAR(255) NOT NULL UNIQUE,
  event_type VARCHAR(120) NOT NULL,
  handler_status VARCHAR(32) NOT NULL DEFAULT 'RECEIVED',
  livemode BOOLEAN NOT NULL DEFAULT FALSE,
  payload JSONB NOT NULL,
  error_message TEXT,
  processed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT stripe_webhook_events_handler_status_check
    CHECK (handler_status IN ('RECEIVED', 'PROCESSED', 'FAILED', 'IGNORED'))
);

CREATE UNIQUE INDEX member_cards_one_active_card_per_user_idx
  ON member_cards (user_id)
  WHERE status = 'ACTIVE';

CREATE UNIQUE INDEX business_profiles_one_active_non_rejected_per_user_idx
  ON business_profiles (user_id)
  WHERE status IN ('UNDER_REVIEW', 'APPROVED', 'PUBLISHED', 'HIDDEN');

CREATE INDEX users_status_created_at_idx
  ON users (status, created_at DESC);

CREATE INDEX member_cards_user_issued_at_idx
  ON member_cards (user_id, issued_at DESC);

CREATE INDEX member_cards_status_expires_at_idx
  ON member_cards (status, expires_at);

CREATE INDEX vip_subscriptions_user_status_period_end_idx
  ON vip_subscriptions (user_id, status, current_period_end DESC);

CREATE INDEX subscriptions_user_kind_status_period_end_idx
  ON subscriptions (user_id, kind, status, current_period_end DESC);

CREATE INDEX subscriptions_business_kind_status_period_end_idx
  ON subscriptions (business_profile_id, kind, status, current_period_end DESC);

CREATE INDEX categories_risk_active_idx
  ON categories (is_high_risk, is_active);

CREATE INDEX countries_active_name_idx
  ON countries (is_active, name);

CREATE INDEX cities_country_active_name_idx
  ON cities (country_id, is_active, name);

CREATE INDEX business_profiles_status_created_at_idx
  ON business_profiles (status, created_at DESC);

CREATE INDEX business_profiles_public_directory_idx
  ON business_profiles (status, country_id, city_id, category_id, published_at DESC);

CREATE INDEX business_profiles_featured_idx
  ON business_profiles (status, featured_top, featured_recommended, published_at DESC);

CREATE INDEX business_introductions_requester_status_created_at_idx
  ON business_introductions (requester_user_id, status, created_at DESC);

CREATE INDEX business_introductions_pair_status_created_at_idx
  ON business_introductions (requester_business_id, target_business_id, status, created_at DESC);

CREATE INDEX business_introductions_target_status_created_at_idx
  ON business_introductions (target_business_id, status, created_at DESC);

CREATE INDEX admin_users_role_active_created_at_idx
  ON admin_users (role, is_active, created_at DESC);

CREATE INDEX admin_sessions_user_expires_idx
  ON admin_sessions (admin_user_id, expires_at DESC);

CREATE INDEX admin_sessions_expires_revoked_idx
  ON admin_sessions (expires_at, revoked_at);

CREATE INDEX audit_logs_actor_created_at_idx
  ON audit_logs (actor_staff_id, created_at DESC);

CREATE INDEX audit_logs_entity_created_at_idx
  ON audit_logs (entity_type, entity_id, created_at DESC);

CREATE INDEX audit_logs_action_created_at_idx
  ON audit_logs (action, created_at DESC);

CREATE INDEX stripe_webhook_events_status_created_at_idx
  ON stripe_webhook_events (handler_status, created_at DESC);

CREATE INDEX stripe_webhook_events_event_type_created_at_idx
  ON stripe_webhook_events (event_type, created_at DESC);

CREATE OR REPLACE FUNCTION reset_business_featured_flags()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status <> 'PUBLISHED' THEN
    NEW.featured_top := FALSE;
    NEW.featured_recommended := FALSE;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER business_profiles_reset_featured_flags
BEFORE INSERT OR UPDATE OF status ON business_profiles
FOR EACH ROW
EXECUTE FUNCTION reset_business_featured_flags();
