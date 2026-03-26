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