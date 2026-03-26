## Prerequisites
```bash
docker --version
docker compose version
```

Yes—you can (and should) run both **DynamoDB Local** and **dynamodb-admin** together using Docker Compose. It’s cleaner, easier to start/stop, and avoids manual steps.

---

## 🛑 First: How to stop your current container

Since you started it with `-d`, it’s running in the background.

### 1. List running containers

```bash
docker ps
```

### 2. Stop it

```bash
docker stop <container_id>
```

(Optional) remove it:

```bash
docker rm <container_id>
```

---

## 🧩 Recommended setup: docker-compose

Create a file called `docker-compose.yml`:

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

---

## ▶️ How to run everything

From the folder with `docker-compose.yml`:

```bash
docker-compose up -d
```

---

## 🌐 Access

* DynamoDB Local → `http://localhost:8000`
* Admin UI → `http://localhost:8001`

---

## 🛑 Stop everything

```bash
docker-compose down
```

