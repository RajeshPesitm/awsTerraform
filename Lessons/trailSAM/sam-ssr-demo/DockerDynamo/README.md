## Prerequisites
```bash
docker --version
docker compose version
python + boto3 # not necessary in your local machine installed directly in your docker container
```
# Experiment 3: Previous Commit Continued
Perfect! Since you prefer **Python + boto3** and want to integrate it with your existing **Docker Compose**, we can do this cleanly. I’ll give you **step-by-step instructions**, including a Python script and how to run it inside Docker.

---

## **Step 1: Update Docker Compose**

You currently have:

```yaml
version: "3.8"

services:
  dynamodb:
    image: amazon/dynamodb-local
    container_name: dynamodb-local
    ports:
      - "8000:8000"
    command: "-jar DynamoDBLocal.jar -sharedDb -inMemory"

  dynamodb-admin:
    image: aaronshaf/dynamodb-admin
    container_name: dynamodb-admin
    ports:
      - "8001:8001"
    environment:
      - DYNAMO_ENDPOINT=http://dynamodb:8000
    depends_on:
      - dynamodb
```

We will **add a Python service** to run your CSV import:

```yaml
  csv-importer:
    build: ./csv-importer
    container_name: csv-importer
    depends_on:
      - dynamodb
    volumes:
      - ./csv-importer:/app
    command: python import_students.py
```

* `./csv-importer` is a folder where we’ll put **Python code + CSV file**.
* `command` runs the script automatically when the container starts.

---

## **Step 2: Create Python Dockerfile**

In `./csv-importer/Dockerfile`:

```dockerfile
FROM python:3.11-slim

WORKDIR /app

# Install boto3
RUN pip install boto3

# Copy all files (CSV + script)
COPY . .

# Default command can also be overwritten by docker-compose
CMD ["python", "import_students.py"]
```

---

## **Step 3: Prepare CSV File**

Inside `./csv-importer/students.csv`:

```csv
Roll,Name
1,John Doe
2,Jane Smith
3,Robert Brown
4,Emily Davis
5,Chris Johnson
6,Alice Williams
7,Michael Miller
8,Sarah Wilson
9,David Moore
10,Linda Taylor
11,Daniel Anderson
12,Nancy Thomas
13,Paul Jackson
14,Karen White
15,Mark Harris
16,Laura Martin
17,Steven Thompson
18,Emma Garcia
19,Kevin Martinez
20,Olivia Robinson
21,Jason Clark
22,Sophia Rodriguez
23,Andrew Lewis
24,Chloe Lee
25,Brian Walker
26,Mia Hall
27,Joshua Allen
28,Lily Young
29,Eric King
30,Grace Scott
```

---

## **Step 4: Python Script to Import CSV**

Create `./csv-importer/import_students.py`:

```python
import boto3
import csv
import time
from botocore.exceptions import ClientError

dynamodb = boto3.resource(
    'dynamodb',
    region_name='us-west-2',
    endpoint_url='http://dynamodb:8000',
    aws_access_key_id='fakeMyKeyId',
    aws_secret_access_key='fakeSecretAccessKey'
)

table_name = 'Student'

# Check if table exists, create if not
try:
    table = dynamodb.Table(table_name)
    table.load()  # will raise exception if table doesn't exist
    print(f"Table {table_name} exists.")
except ClientError as e:
    if e.response['Error']['Code'] == 'ResourceNotFoundException':
        print(f"Creating table {table_name}...")
        table = dynamodb.create_table(
            TableName=table_name,
            KeySchema=[
                {'AttributeName': 'Roll', 'KeyType': 'HASH'}  # Partition key
            ],
            AttributeDefinitions=[
                {'AttributeName': 'Roll', 'AttributeType': 'N'}
            ],
            BillingMode='PAY_PER_REQUEST'
        )
        # Wait until the table exists
        table.wait_until_exists()
        print(f"Table {table_name} created.")
    else:
        raise

# Insert CSV data
with open('students.csv', newline='') as csvfile:
    reader = csv.DictReader(csvfile)
    with table.batch_writer() as batch:
        for row in reader:
            batch.put_item(
                Item={
                    'Roll': int(row['Roll']),
                    'Name': row['Name']
                }
            )

print("All students inserted successfully!")
```

✅ Notes:

* `batch_writer()` automatically handles batch limits of 25 items.
* `time.sleep(5)` ensures DynamoDB container is up before Python tries to connect. You can increase if necessary.

---

## **Step 5: Run Everything**

From your project root:

```bash
docker-compose up --build
```
- [TrubleShoot.md](TrubleShoot.md) – **(Possible exception may likley happen but not definite)** TrubleShoot hint  
* This will start **DynamoDB Local**, **DynamoDB Admin**, and **Python CSV importer**.
* After a few seconds, your table `Student` will have all 30 rows.

---

## **Step 6: Verify in DynamoDB Admin**

* Open [http://localhost:8001](http://localhost:8001)
* Select `Student` table → you should see all 30 rows.

---

If you want, I can **also modify the script** so you don’t even need `time.sleep()` by making Python **wait for DynamoDB to be ready** automatically before inserting, which is more robust in Docker Compose.

Do you want me to do that?




### Stop doker compose
- [DockerClean.md](DockerClean.md) – **(Command to Stop Docker file and clean Docker containers)** TrubleShoot hint  


