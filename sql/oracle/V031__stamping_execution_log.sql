-- WO-82
CREATE TABLE stamping_execution_log (
  log_id       RAW(16) DEFAULT SYS_GUID() PRIMARY KEY,
  job_name     VARCHAR2(128),
  status       VARCHAR2(32),
  run_started  TIMESTAMP,
  run_finished TIMESTAMP
);
