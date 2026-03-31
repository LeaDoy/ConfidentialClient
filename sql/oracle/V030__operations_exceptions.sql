-- WO-33: operations exceptions
CREATE TABLE operations_exceptions (
  exception_id   RAW(16) DEFAULT SYS_GUID() PRIMARY KEY,
  transaction_id VARCHAR2(64),
  reason         VARCHAR2(512),
  status         VARCHAR2(32) DEFAULT 'OPEN',
  created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);
