terraform {
  backend "s3" {
    bucket = "my-terraform-state-bucket-rajeshpesitm"
    key    = "lessons/day22/terraform.tfstate"
    region = "us-east-1"
    use_lockfile  = "true"
    encrypt        = "true"
  }
}
