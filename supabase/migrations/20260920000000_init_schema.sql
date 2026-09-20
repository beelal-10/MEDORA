-- Supabase Initial Migration Schema for MEDORA Medicine Database

CREATE TABLE IF NOT EXISTS medicines (
    id TEXT PRIMARY KEY,
    brand_name TEXT NOT NULL,
    generic_name TEXT NOT NULL,
    active_ingredients TEXT[] NOT NULL DEFAULT '{}',
    strength TEXT NOT NULL,
    dosage_form TEXT NOT NULL,
    manufacturer TEXT NOT NULL,
    nafdac_reg_number TEXT NOT NULL UNIQUE,
    uses JSONB NOT NULL DEFAULT '{"en":[], "ha":[]}'::jsonb,
    warnings JSONB NOT NULL DEFAULT '{"en":[], "ha":[]}'::jsonb,
    side_effects JSONB NOT NULL DEFAULT '{"en":[], "ha":[]}'::jsonb,
    storage JSONB NOT NULL DEFAULT '{"en":"", "ha":""}'::jsonb,
    verified BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Scan Logs Audit & Analytics Table (No private health data or image binary stored)
CREATE TABLE IF NOT EXISTS scan_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    match_status TEXT NOT NULL,
    confidence NUMERIC(4,3) NOT NULL,
    medicine_id TEXT REFERENCES medicines(id) ON DELETE SET NULL,
    language TEXT NOT NULL DEFAULT 'en'
);

-- Indexes for fast exact and fuzzy searching
CREATE INDEX IF NOT EXISTS idx_medicines_brand_name ON medicines USING gin (to_tsvector('english', brand_name));
CREATE INDEX IF NOT EXISTS idx_medicines_generic_name ON medicines USING gin (to_tsvector('english', generic_name));
