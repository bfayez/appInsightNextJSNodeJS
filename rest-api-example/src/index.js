const appInsights = require('applicationinsights');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

// Replace with instumenation key: appInsights.setup('12345-56789-2345678-a39586900');
appInsights.setup('<Replace - App Insight Instrumenation Key>');

appInsights.defaultClient.context.tags[appInsights.defaultClient.context.keys.cloudRole] = 'Api 1';
appInsights.start();

const app = express();
const PORT = process.env.PORT || 3000;

// Sample data - in-memory storage for demonstration purposes
let tasks = [
  { id: 1, title: 'Task 1 - Web1', description: 'Description for Task 1' },
  { id: 2, title: 'Task 2 - Web1', description: 'Description for Task 2' },
];

const corsOptions = {
  origin: 'http://localhost:3001'
}
app.use(cors(corsOptions));

// Middleware to parse incoming requests
app.use(bodyParser.json());

// Add Application Insights middleware
app.use((req, res, next) => {
  
    // Log exception telemetry
    res.on('finish', () => {
      const { statusCode } = res;
      if (statusCode < 200 || statusCode >= 400) {
        const exception = new Error(`${req.method} ${req.path} ${statusCode}`);
        appInsights.defaultClient.trackException({ exception });
      }
    });
  
    next();
  });

// Endpoint to get all tasks
app.get('/api/tasks', async (req, res) => {

  console.log(JSON.stringify(req.headers));

  const apiEndpoint = 'http://localhost:3100/api/tasks';

  const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
  const response = await fetch(apiEndpoint);

  const tasks1 = await response.json();

  res.json(tasks.concat(tasks1));
});

// Endpoint to get a specific task by ID
app.get('/api/tasks/:id', (req, res) => {
  const taskId = parseInt(req.params.id);
  const task = tasks.find((t) => t.id === taskId);

  if (!task) {
    return res.status(404).json({ message: 'Task not found' });
  }

  res.json(task);
});

// Endpoint to create a new task
app.post('/api/tasks', (req, res) => {
  const { title, description } = req.body;

  if (!title || !description) {
    return res.status(400).json({ message: 'Title and description are required' });
  }

  const newTask = {
    id: tasks.length + 1,
    title,
    description,
  };

  tasks.push(newTask);
  res.status(201).json(newTask);
});

// Endpoint to update a task by ID
app.put('/api/tasks/:id', (req, res) => {
  const taskId = parseInt(req.params.id);
  const taskIndex = tasks.findIndex((t) => t.id === taskId);

  if (taskIndex === -1) {
    return res.status(404).json({ message: 'Task not found' });
  }

  const { title, description } = req.body;

  if (!title || !description) {
    return res.status(400).json({ message: 'Title and description are required' });
  }

  tasks[taskIndex] = { ...tasks[taskIndex], title, description };
  res.json(tasks[taskIndex]);
});

// Endpoint to delete a task by ID
app.delete('/api/tasks/:id', (req, res) => {
  const taskId = parseInt(req.params.id);
  const taskIndex = tasks.findIndex((t) => t.id === taskId);

  if (taskIndex === -1) {
    return res.status(404).json({ message: 'Task not found' });
  }

  const deletedTask = tasks.splice(taskIndex, 1);
  res.json(deletedTask[0]);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
