CREATE TABLE IF NOT EXISTS "group" (
  group_id SERIAL,
  "name" VARCHAR(255) NOT NULL,
  PRIMARY KEY (group_id),
  CONSTRAINT unique_name UNIQUE ("name")
)