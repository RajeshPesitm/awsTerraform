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
