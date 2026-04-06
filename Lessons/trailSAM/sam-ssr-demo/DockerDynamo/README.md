# 🏗️ Revised Fullstack Architecture

Here’s your clean architecture:

```id="flow1"
                ┌──────────────┐
                │   React UI   │
                └──────┬───────┘
                       ↓ HTTP
                ┌──────────────┐
                │   Backend    │  (Node.js + Express)
                └──────┬───────┘
                       ↓ SDK
                ┌──────────────┐
                │  DynamoDB    │
                └──────────────┘


     (One-time job)
     ┌────────────────────┐
     │ Python CSV Import  │
     └────────────────────┘
                ↓
           DynamoDB
```



# ⚙️ Step 1 & 2: Add Backend (Node.js + Express)
- [README.md backend](backend/README.md) – **(Steps to deploy backend container)** 

# 🎨 Step 3 & 4: Add Frontend (React)
- [README.md frontend](frontend/README.md) – **(Steps to deploy frontend container)** 


# 🚀 Final Flow

When everything runs:

1. CSV importer → populates DynamoDB
2. Backend → exposes API
3. React → fetches data from backend



# Step 5: Run Everything
### First: Run the Full Stack:
```bash
docker compose up --build
```
- Alternatively, this also works
        ```bash
        docker compose up -d
        ```

### Then: Run importer explicitly:
```bash
docker compose --profile tools run --rm csv-importer
```

- [TrubleShoot.md](TrubleShoot.md) – **(Possible exception may likley happen but not definite)** TrubleShoot hint  
* This will start **DynamoDB Local**, **DynamoDB Admin**, and **Python CSV importer**.
* After a few seconds, your table `Student` will have all 30 rows.

---

# **Step 6: Verify in DynamoDB Admin and React**

* Open React Frontend [http://localhost:3001/](http://localhost:3001)
* Open [http://localhost:8001](http://localhost:8001)
* Select `Student` table → you should see all 30 rows.






### Stop doker compose
- [DockerClean.md](DockerClean.md) – **(Command to Stop Docker file and clean Docker containers)** TrubleShoot hint  


