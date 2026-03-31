resource "aws_kms_key" "main" {
  description             = "${local.name} application CMK"
  deletion_window_in_days = 10
  enable_key_rotation     = true
}

resource "aws_kms_alias" "main" {
  name          = "alias/${local.name}-app"
  target_key_id = aws_kms_key.main.key_id
}
