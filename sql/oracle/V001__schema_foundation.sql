-- WO-2: database schema foundation (expand per blueprint)
-- Run with your migration tool / DBA process (Flyway/Liquibase)

CREATE TABLE bridge_schema_version (
  version     NUMBER(10) PRIMARY KEY,
  description VARCHAR2(256) NOT NULL,
  applied_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);
