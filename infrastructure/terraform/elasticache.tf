resource "aws_elasticache_subnet_group" "redis" {
  name       = "${local.name}-redis"
  subnet_ids = [aws_subnet.private_a.id, aws_subnet.private_b.id]
}

resource "aws_elasticache_replication_group" "redis" {
  replication_group_id = substr("${local.name}-ce", 0, 40)
  description          = "Bridge Redis (${local.name})"

  engine               = "redis"
  engine_version       = "7.1"
  node_type            = var.redis_node_type
  num_cache_clusters   = 1
  port                 = 6379
  subnet_group_name    = aws_elasticache_subnet_group.redis.name
  security_group_ids   = [aws_security_group.redis.id]
  parameter_group_name = "default.redis7"

  at_rest_encryption_enabled = true
  transit_encryption_enabled = false

  automatic_failover_enabled = false
  snapshot_retention_limit   = 5
  apply_immediately          = true

  final_snapshot_identifier = var.environment == "prod" ? "${local.name}-redis-final" : null
  skip_final_snapshot       = var.environment != "prod"
}
