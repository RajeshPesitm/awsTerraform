### **Stop Docker compose**
```bash
docker compose down
```


### **1️⃣ Stop running containers (if any are still running)**

```bash
docker stop $(docker ps -q)
```

* `docker ps -q` lists **all running container IDs**.
* `docker stop` stops them gracefully.

> In your case, they are already exited, so this step isn’t strictly needed.

---

### **2️⃣ Remove all containers**

```bash
docker rm $(docker ps -a)
```

* `docker ps -a ` lists **all containers, stopped**.
* `docker rm` deletes them.
* After this, `docker ps -a` should show nothing.

---