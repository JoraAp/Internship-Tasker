import { useState, useEffect } from 'react';
import axios from 'axios';


interface Task {
  id: string;
  text: string;
  completed: boolean;
  createdAt: string;
  completedAt?: string;
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

  const handleToggleTask = async (task: Task) => {
    try {
      const response = await axios.put<Task>(`${API_URL}/${task.id}`, { 
        completed: !task.completed 
      });

      if (!response.data.completed && response.data.completedAt) {
        delete response.data.completedAt;
      }
      
      setTasks(tasks.map(t => t.id === task.id ? response.data : t));
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await axios.delete(`${API_URL}/${taskId}`);
      setTasks(tasks.filter(t => t.id !== taskId));
    } catch (error) {
      console.error("Error deleting task:", error);
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
      alignItems: 'center',
      gap: '12px'
    }}>
      <input 
        type="checkbox" 
        checked={task.completed}
        onChange={() => handleToggleTask(task)}
        style={{ cursor: 'pointer', width: '18px', height: '18px' }}
      />
      <div style={{ flex: 1 }}>
        <span style={{ textDecoration: task.completed ? 'line-through' : 'none', opacity: task.completed ? 0.6 : 1 }}>
          {task.text}
        </span>
        <div style={{ fontSize: '0.85rem', color: '#999', marginTop: '4px' }}>
          Created: {formatTime(task.createdAt)}
        </div>
        {task.completedAt && (
          <div style={{ fontSize: '0.85rem', color: '#4CAF50', marginTop: '4px' }}>
            Completed: {formatTime(task.completedAt)}
          </div>
        )}
      </div>
      <button 
        onClick={() => handleDeleteTask(task.id)}
        style={{ padding: '6px 12px', cursor: 'pointer', backgroundColor: '#ff4444', color: 'white', border: 'none', borderRadius: '4px' }}
      >
        Delete
      </button>
    </li>
  ))}
</ul>
      
      {tasks.length === 0 && <p style={{ color: '#888' }}>No tasks yet. Add one above!</p>}
    </div>
  );
}

export default App;