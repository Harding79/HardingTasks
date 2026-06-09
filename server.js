const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to handle JSON and static files
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Temporary local database for HardingTasks
let tasks = [
    { id: 1, title: "Configure Pi App Studio", completed: true },
    { id: 2, title: "Launch HardingTasks on server", completed: false },
    { id: 3, title: "Submit post link in Pi App", completed: false }
];

// API Routes for tasks
app.get('/api/tasks', (req, res) => {
    res.json(tasks);
});

app.post('/api/tasks', (req, res) => {
    const newTask = {
        id: tasks.length + 1,
        title: req.body.title,
        completed: false
    };
    tasks.push(newTask);
    res.status(201).json(newTask);
});

app.put('/api/tasks/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const task = tasks.find(t => t.id === id);
    if (task) {
        task.completed = !task.completed;
        res.json(task);
    } else {
        res.status(404).json({ message: "Task not found" });
    }
});

// Serve the user interface
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
    console.log(`=========================================`);
    console.log(` HardingTasks is running on port ${PORT}`);
    console.log(` Ready for Vibe Coder / Pi integration   `);
    console.log(`=========================================`);
});
