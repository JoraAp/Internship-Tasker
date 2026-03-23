import express from 'express';
import type { Request, Response } from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url'; 

const DATA_FILE = './tasks.json';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;
const DB_PATH = path.join(__dirname, 'tasks.json');


app.use(cors());

app.use(express.json());

interface Task {
  id: string;
  text: string;
  completed: boolean;
  createdAt: string;
  completedAt?: string;
}


if (!fs.existsSync(DB_PATH)) {
  fs.writeFileSync(DB_PATH, JSON.stringify([]));
}


const getTasksFromFile = (): Task[] => {
  const data = fs.readFileSync(DB_PATH, 'utf-8');
  return JSON.parse(data);
};


const saveTasksToFile = (tasks: Task[]) => {
  fs.writeFileSync(DB_PATH, JSON.stringify(tasks, null, 2));
};

// --- API Endpoints ---


app.get('/tasks', (req: Request, res: Response) => {
  const tasks = getTasksFromFile();
  res.json(tasks);
});


app.post('/tasks', (req: Request, res: Response) => {
  const tasks = getTasksFromFile();
  
  const newTask: Task = {
    id: Date.now().toString(),
    text: req.body.text,
    completed: false,
    createdAt: new Date().toISOString()
  };

  tasks.push(newTask);
  saveTasksToFile(tasks);
  
  res.status(201).json(newTask);
});

app.put('/tasks/:id', (req: Request, res: Response) => {
  const tasks = getTasksFromFile();
  const task = tasks.find(t => t.id === req.params.id);
  
  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }
  
  task.completed = req.body.completed;
  if (req.body.completed) {
    task.completedAt = new Date().toLocaleString();
  }
  
  saveTasksToFile(tasks);
  res.json(task);
});

app.delete('/tasks/:id', (req: Request, res: Response) => {
  const tasks = getTasksFromFile();
  const filteredTasks = tasks.filter(t => t.id !== req.params.id);
  
  if (tasks.length === filteredTasks.length) {
    return res.status(404).json({ error: 'Task not found' });
  }
  
  saveTasksToFile(filteredTasks);
  res.status(200).json({ success: true });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});