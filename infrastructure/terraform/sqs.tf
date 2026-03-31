resource "aws_sqs_queue" "bridge_to_mule_dlq" {
  name                              = "${local.name}-bridge-to-mule-dlq"
  kms_master_key_id                 = aws_kms_key.main.arn
  kms_data_key_reuse_period_seconds = 300
}

resource "aws_sqs_queue" "bridge_to_mule" {
  name                              = "${local.name}-bridge-to-mule"
  visibility_timeout_seconds        = 300
  kms_master_key_id                 = aws_kms_key.main.arn
  kms_data_key_reuse_period_seconds = 300

  redrive_policy = jsonencode({
    deadLetterTargetArn = aws_sqs_queue.bridge_to_mule_dlq.arn
    maxReceiveCount     = 5
  })
}

resource "aws_sqs_queue" "mule_to_bridge_dlq" {
  name                              = "${local.name}-mule-to-bridge-dlq"
  kms_master_key_id                 = aws_kms_key.main.arn
  kms_data_key_reuse_period_seconds = 300
}

resource "aws_sqs_queue" "mule_to_bridge" {
  name                              = "${local.name}-mule-to-bridge"
  visibility_timeout_seconds        = 300
  kms_master_key_id                 = aws_kms_key.main.arn
  kms_data_key_reuse_period_seconds = 300

  redrive_policy = jsonencode({
    deadLetterTargetArn = aws_sqs_queue.mule_to_bridge_dlq.arn
    maxReceiveCount     = 5
  })
}
