# 🎨 Step 3: Add Frontend (React)

Create frontend:

```bash
npx create-react-app frontend
```

---

## Simple React UI

Edit `frontend/src/App.js`:

```js
import { useEffect, useState } from "react";

function App() {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/students")
      .then(res => res.json())
      .then(data => setStudents(data));
  }, []);

  return (
    <div>
      <h1>Students</h1>
      <ul>
        {students.map(s => (
          <li key={s.Roll}>
            {s.Roll} - {s.Name}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
```

# Step 3.1: Create Frontend Dockerfile)


```bash
frontend/Dockerfile
```

Add:

```Dockerfile
FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

ENV HOST=0.0.0.0

CMD ["npm", "start"]
```

---

# 🔗 Step 4: Add Frontend to Docker

Add to `docker-compose.yml`:

```yaml
  frontend:
    build: ./frontend
    container_name: frontend
    ports:
      - "3001:3000"
    volumes:
      - ./frontend:/app
```