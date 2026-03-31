output "alb_dns_name" {
  description = "Public ALB hostname (WO-74)"
  value       = aws_lb.main.dns_name
}

output "cloudfront_domain_name" {
  description = "Static asset CDN (WO-72)"
  value       = aws_cloudfront_distribution.static.domain_name
}

output "apigateway_endpoint" {
  description = "HTTP API endpoint (WO-71)"
  value       = aws_apigatewayv2_api.http.api_endpoint
}

output "cognito_user_pool_id" {
  description = "Auth user pool (WO-77)"
  value       = aws_cognito_user_pool.main.id
}

output "cognito_client_id" {
  value = aws_cognito_user_pool_client.public.id
}

output "cognito_domain_prefix" {
  value = aws_cognito_user_pool_domain.main.domain
}

output "dynamodb_sessions_table" {
  value = aws_dynamodb_table.user_sessions.name
}

output "elasticache_primary_endpoint" {
  value     = aws_elasticache_replication_group.redis.primary_endpoint_address
  sensitive = true
}

output "sqs_bridge_to_mule_url" {
  value = aws_sqs_queue.bridge_to_mule.url
}

output "sqs_mule_to_bridge_url" {
  value = aws_sqs_queue.mule_to_bridge.url
}

output "vpc_id" {
  value = aws_vpc.main.id
}
