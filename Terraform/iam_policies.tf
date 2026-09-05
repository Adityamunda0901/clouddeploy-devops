resource "aws_iam_role_policy_attachment" "ssm" {
  role       = aws_iam_role.clouddeploy_ssm.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonSSMManagedInstanceCore"
}
resource "aws_iam_role_policy_attachment" "cloudwatch" {
  role       = aws_iam_role.clouddeploy_ssm.name
  policy_arn = "arn:aws:iam::aws:policy/CloudWatchAgentServerPolicy"
}