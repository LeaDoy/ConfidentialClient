-- WO-26: BGFS staging table (skeleton)
CREATE TABLE bgfs_staging (
  id            RAW(16) DEFAULT SYS_GUID() PRIMARY KEY,
  batch_id      VARCHAR2(64),
  record_json   CLOB,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);
