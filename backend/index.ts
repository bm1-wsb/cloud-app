import express from 'express';
import cors from 'cors';
import sql from 'mssql';
 
const config = {
    user: 'sa',
    password: 'StrongPassword123!',
    server: 'cloud-db', // Nazwa serwera musi być taka sama jak nazwa usługi w docker-compose
    port: 1433,
    database: 'master',
    options: {
        encrypt: false, // W środowisku lokalnym/kontenerze często ustawiamy na false
        trustServerCertificate: true 
    }
};
 
async function connectToDB() {
    try {
        await sql.connect(config);
        console.log("Połączono z bazą danych cloud-db!");
    } catch (err) {
        console.error("Błąd połączenia z bazą:", err);
    }
}
 
const app = express();
app.use(cors());
app.use(express.json());
 
// Nasza "baza danych" w pamięci
let tasks = [
    { id: 1, title: "Dokoncz projekt", description: "Opis 1", completed: false },
    { id: 2, title: "Zadanie 2", description: "Opis 2", completed: true }
];
 
// 1. READ (Lista) - GET /api/tasks
app.get('/api/tasks', (req, res) => res.json(tasks));
 
// 2. READ (Szczegóły) - GET /api/tasks/:id
app.get('/api/tasks/:id', (req, res) => {
    const task = tasks.find(t => t.id === parseInt(req.params.id));
    task ? res.json(task) : res.status(404).send("Nie znaleziono");
});
 
// 3. CREATE (Dodaj) - POST /api/tasks
app.post('/api/tasks', (req, res) => {
    const newTask = { id: Date.now(), ...req.body };
    tasks.push(newTask);
    res.status(201).json(newTask);
});
 
// 4. UPDATE (Edytuj) - PUT /api/tasks/:id
app.put('/api/tasks/:id', (req, res) => {
    const id = parseInt(req.params.id);
    tasks = tasks.map(t => t.id === id ? { ...t, ...req.body } : t);
    res.send("Zaktualizowano");
});
 
// 5. DELETE (Usuń) - DELETE /api/tasks/:id
app.delete('/api/tasks/:id', (req, res) => {
    tasks = tasks.filter(t => t.id !== parseInt(req.params.id));
    res.status(204).send();
});

// 6.  GET
app.get('/api/tasks', async (req, res) => {
    try {
        const result = await sql.query`SELECT * FROM Tasks`;
        res.json(result.recordset); // teraz dane płyną z Azure SQL Edge
    } catch (err) {
        res.status(500).send(err);
    }
});
 
 
app.listen(8081, () => console.log("Backend działa na porcie 8081"));