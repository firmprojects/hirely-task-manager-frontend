const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Mock database
const tasks = [
    { id: 1, title: 'Task 1', completed: false },
    { id: 2, title: 'Task 2', completed: true },
    { id: 3, title: 'Task 3', completed: false }
];

// Route to fetch tasks
app.get('/api/tasks', (req, res) => {
    res.json(tasks);
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
