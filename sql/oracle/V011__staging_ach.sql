-- WO-93: STG_ACH_PROVISIONAL_CREDITS (skeleton)
CREATE TABLE stg_ach_provisional_credits (
  id             RAW(16) DEFAULT SYS_GUID() PRIMARY KEY,
  payload        CLOB,
  loaded_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);
