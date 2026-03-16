import express from 'express';
import type { Request, Response } from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url'; 


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
    completed: false
  };

  tasks.push(newTask);
  saveTasksToFile(tasks);
  
  res.status(201).json(newTask);
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});