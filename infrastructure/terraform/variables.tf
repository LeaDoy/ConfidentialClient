variable "aws_region" {
  type        = string
  description = "AWS region"
  default     = "us-east-1"
}

variable "project" {
  type        = string
  description = "Project tag / name prefix"
  default     = "bridge"
}

variable "environment" {
  type        = string
  description = "Environment key (dev, qa, uat, prod)"
  default     = "dev"
}

variable "enable_nat_gateway" {
  type        = bool
  description = "NAT gateways for private subnets (set true if ECS tasks run in private subnets without public IPs)"
  default     = false
}

variable "redis_node_type" {
  type        = string
  description = "ElastiCache node type"
  default     = "cache.t4g.micro"
}

variable "alb_certificate_arn" {
  type        = string
  description = "Optional ACM cert ARN for HTTPS listener; leave empty for HTTP-only ALB"
  default     = null
}
