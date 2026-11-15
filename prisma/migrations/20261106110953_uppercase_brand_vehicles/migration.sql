-- Data master kendaraan disimpan KAPITAL (lihat normalizeUpper di utils/normalize.ts),
-- supaya "Honda" & "honda" tidak tercatat sebagai merek berbeda.
UPDATE "brand_vehicles"
SET "name" = UPPER(REGEXP_REPLACE(BTRIM("name"), '\s+', ' ', 'g')),
    "type" = UPPER(REGEXP_REPLACE(BTRIM("type"), '\s+', ' ', 'g'));
