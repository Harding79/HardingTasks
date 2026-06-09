const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Base de données temporaire
let tasks = [
    { id: 1, title: "Configure Pi App Studio", completed: true },
    { id: 2, title: "Launch HardingTasks on server", completed: false },
    { id: 3, title: "Submit post link in Pi App", completed: false }
];

// Route d'authentification demandée par l'API Pi
app.post('/auth/pi', async (req, res) => {
    const { accessToken } = req.body;
    if (!accessToken) {
        return res.status(400).json({ error: "Access token missing" });
    }

    try {
        // Validation du jeton auprès de Pi Network (Pas de clé API requise pour ce flux)
        const response = await fetch('https://api.minepi.com/v2/me', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });

        if (!response.ok) {
            return res.status(401).json({ error: "Invalid Pi Access Token" });
        }

        const piUser = await response.json();
        res.json({ status: "success", user: piUser });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error during Pi Auth" });
    }
});

// Routes API pour les tâches
app.get('/api/tasks', (req, res) => { res.json(tasks); });

app.post('/api/tasks', (req, res) => {
    const newTask = { id: tasks.length + 1, title: req.body.title, completed: false };
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

app.get('*', (req, res) => { res.sendFile(path.join(__dirname, 'public', 'index.html')); });

app.listen(PORT, () => {
    console.log(`HardingTasks Secure Server active on port ${PORT}`);
});
