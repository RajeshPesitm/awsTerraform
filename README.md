# Commit 4: Path: /Lessons/trailSAM/sam-ssr-demo/DockerDynamo
DynamoDB and DynamoDBadmin in Docker-Compose


# Important Udates in this commit 3 Path /Lessons/http-function-url-tutorial
- Lets Run Locally using aws sam and dynamo DB in docker
Absolutely! Here’s a clear, step-by-step guide to **install AWS SAM CLI on Ubuntu**:

---

## **Step 1: Install prerequisites**

### verify if it is installed already
```bash
sam --version
```

SAM CLI requires:

* **Homebrew or apt** (we’ll use apt)
* **Docker** (for local Lambda emulation)
* **unzip** and **curl**

Run:

```bash
sudo apt update
sudo apt install -y unzip curl
```

---

## **Step 2: Download the latest SAM CLI release**

Check the latest release here: [https://github.com/aws/aws-sam-cli/releases](https://github.com/aws/aws-sam-cli/releases)

For Linux (x86_64), for example:

```bash
curl -Lo sam.zip https://github.com/aws/aws-sam-cli/releases/latest/download/aws-sam-cli-linux-x86_64.zip
```

---

## **Step 3: Unzip and install**

```bash
unzip sam.zip -d sam-installation
sudo ./sam-installation/install
```

* This installs the `sam` executable into `/usr/local/bin`

---

## **Step 4: Verify installation**

```bash
sam --version
```

You should see something like:

```
SAM CLI, version 1.x.x
```

---

## **Step 5: Install Docker**
Verify first:

```bash
docker --version
```

SAM uses Docker to run Lambda locally.

```bash
sudo apt install -y docker.io
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -aG docker $USER
```

> Log out and back in to apply Docker group permissions.

Verify:

```bash
docker --version
```

---

## ✅ **Optional: Test SAM CLI**

```bash
sam --help
sam init
sam build
sam local invoke
```

* `sam local invoke` runs your Lambda function locally inside Docker

## Dynamo DB Setup
```bash
sudo docker run -d -p 8000:8000 amazon/dynamodb-local

sudo docker ps






 aws dynamodb create-table \
  --table-name formStore \
  --attribute-definitions AttributeName=PK,AttributeType=S AttributeName=SK,AttributeType=S \
  --key-schema AttributeName=PK,KeyType=HASH AttributeName=SK,KeyType=RANGE \
  --billing-mode PAY_PER_REQUEST \
  --endpoint-url http://localhost:8000 \
  --region us-east-1





aws dynamodb list-tables \
  --endpoint-url http://localhost:8000 \
  --region us-east-1


# very important
export DYNAMODB_ENDPOINT=http://localhost:8000

```


### Run Using sam
- trubleshoot
```bash
# SAM can’t talk to Docker unless your user is in the docker group
sudo usermod -aG docker $USER

```


# Important Updates in this Commit2: Path /Lessons/http-function-url-tutorial
- Added Update / Delete Buttons
- Updated policy attached to role of Lanbda function (Lamda->Role->policy)

    ```JSON
        {
        "Effect": "Allow",
        "Action": [
            "dynamodb:DeleteItem",
            "dynamodb:PutItem",
            "dynamodb:UpdateItem",
            "dynamodb:Query"
        ],
        "Resource": "*"
        }
    ```
- Lets see whats coming next





### Original Reference
- [Tutorial](https://github.com/piyushsachdeva/Terraform-Full-Course-Aws)

### Tasks Completed
- Day 02 and 03
- Day 13 Created vpc, Subnet, EC2
- Day 14 Hosted a web Application
- Day 22 Deployed a two tier web Application on 9 March: Students were busy writing IA


### Students Guide
```bash
git clone https://github.com/RajeshPesitm/awsTerraform
```

#### See the diffrence local to remote
```bash
git fetch origin
git diff main origin/main
```

#### pull and merge by keeping remote changes and ignore local changes (sync with remote)
```bash
git pull origin main --no-rebase --allow-unrelated-histories -X theirs
``` 


