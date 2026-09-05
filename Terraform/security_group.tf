resource "aws_security_group" "clouddeploy" {
  name        = "launch-wizard-2"
  description = "launch-wizard-2 created 2026-09-03T04:37:26.553Z"
  vpc_id      = "vpc-0f145a8d8a6693e6a"

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["49.37.113.202/32"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}