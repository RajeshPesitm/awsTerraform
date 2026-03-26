FROM python:3.11-slim

WORKDIR /app

# Install boto3
RUN pip install boto3

# Copy all files (CSV + script)
COPY . .

# Default command can also be overwritten by docker-compose
CMD ["python", "import_students.py"]