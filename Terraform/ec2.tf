resource "aws_instance" "clouddeploy" {
  ami           = "ami-0b6d9d3d33ba97d99"
  instance_type = "t3.micro"

  subnet_id              = "subnet-01ff7a2b89ef534d7"
  vpc_security_group_ids = ["sg-038796ee5850b2729"]
  key_name               = "clouddeploy"

  iam_instance_profile = "CloudDeploy-SSM-Role"

  associate_public_ip_address = true

  tags = {
    Name = "Clouddeploy"
  }
}