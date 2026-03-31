-- WO-93: LOCATION_MASTER (skeleton)
CREATE TABLE location_master (
  location_id    VARCHAR2(64) PRIMARY KEY,
  name           VARCHAR2(256),
  created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);
