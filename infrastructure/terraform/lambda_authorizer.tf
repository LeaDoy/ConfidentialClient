data "archive_file" "api_authorizer" {
  type        = "zip"
  source_file = "${path.module}/../../apps/lambda/authorizer/handler.py"
  output_path = "${path.module}/.build/authorizer.zip"
}

resource "aws_lambda_function" "api_authorizer" {
  function_name    = "${local.name}-api-authorizer"
  role             = aws_iam_role.lambda_authorizer.arn
  handler          = "handler.lambda_handler"
  runtime          = "python3.12"
  filename         = data.archive_file.api_authorizer.output_path
  source_code_hash = data.archive_file.api_authorizer.output_base64sha256
  timeout          = 5
}
