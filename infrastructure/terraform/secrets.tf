resource "aws_secretsmanager_secret" "app" {
  name       = "${local.name}/app-config"
  kms_key_id = aws_kms_key.main.id
}

resource "aws_secretsmanager_secret_version" "app" {
  secret_id     = aws_secretsmanager_secret.app.id
  secret_string = jsonencode({ note = "Populate via pipeline or break-glass rotation (WO-63)" })
}
