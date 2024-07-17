variable "aws_region" {
  description = "The AWS region to deploy to"
  default     = "us-east-1"
}

variable "ecr_repository_url" {
  description = "The URL of the ECR repository"
}
