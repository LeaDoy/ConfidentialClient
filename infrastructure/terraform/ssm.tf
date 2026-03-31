resource "aws_ssm_parameter" "hierarchy_root" {
  name  = "/bridge/${var.environment}/deployment/target"
  type  = "String"
  value = "ecs"
}

resource "aws_ssm_parameter" "queue_bridge_to_mule" {
  name  = "/bridge/${var.environment}/sqs/bridge_to_mule_url"
  type  = "String"
  value = aws_sqs_queue.bridge_to_mule.url
}

resource "aws_ssm_parameter" "queue_mule_to_bridge" {
  name  = "/bridge/${var.environment}/sqs/mule_to_bridge_url"
  type  = "String"
  value = aws_sqs_queue.mule_to_bridge.url
}
