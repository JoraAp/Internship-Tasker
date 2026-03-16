import { useState, useEffect } from 'react';
import axios from 'axios';


interface Task {
  id: string;
  text: string;
  completed: boolean;
}

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskText, setTaskText] = useState('');

   const API_URL = 'http://localhost:3000/tasks';

  useEffect(() => {
    const loadTasks = async () => {
      try {
        const response = await axios.get<Task[]>(API_URL);
        setTasks(response.data);
      } catch (error) {
        console.error("Error fetching tasks. Is your backend running?", error);
      }
    };
    loadTasks();
  }, []);
 
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskText.trim()) return;

    try {
      const response = await axios.post<Task>(API_URL, { text: taskText });
      setTasks([...tasks, response.data]);
      setTaskText('');
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  return (
    <div style={{ padding: '40px', maxWidth: '500px', margin: '0 auto', fontFamily: 'system-ui' }}>
      <h1>Tasker</h1>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <input 
          type="text" 
          value={taskText}
          onChange={(e) => setTaskText(e.target.value)}
          placeholder="What needs to be done?"
          style={{ flex: 1, padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
        />
        <button type="submit" style={{ padding: '10px 20px', cursor: 'pointer' }}>
          Add Task
        </button>
      </form>


      <ul style={{ listStyle: 'none', padding: 0 }}>
        {tasks.map((task) => (
          <li key={task.id} style={{ 
            padding: '12px', 
            borderBottom: '1px solid #eee',
            display: 'flex',
            alignItems: 'center'
          }}>
            <span style={{ fontSize: '1.2rem', marginRight: '10px' }}>
              {task.completed ? '✅' : '⏳'}
            </span>
            {task.text}
          </li>
        ))}
      </ul>
      
      {tasks.length === 0 && <p style={{ color: '#888' }}>No tasks yet. Add one above!</p>}
    </div>
  );
}

export default App;