// api/tasks.js
// Usando let para permitir modificação do array
let tasks = [
    { id: 1, title: "Fazer deploy", completed: false },
    { id: 2, title: "Resolver CORS", completed: true },
];

export default function handler(req, res) {
    // Configurar CORS para todos os métodos
    res.setHeader("Access-Control-Allow-Origin", "https://task-manager-phi-jade-95.vercel.app");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.setHeader("Access-Control-Allow-Credentials", "true");

    // Responder às requisições OPTIONS (preflight)
    if (req.method === "OPTIONS") {
        return res.status(200).end();
    }

    // GET - Listar todas as tarefas
    if (req.method === "GET") {
        return res.status(200).json(tasks);
    }

    // POST - Criar nova tarefa
    if (req.method === "POST") {
        const { title } = req.body;
        
        if (!title) {
            return res.status(400).json({ error: "Título é obrigatório" });
        }

        const newTask = {
            id: tasks.length > 0 ? Math.max(...tasks.map(t => t.id)) + 1 : 1,
            title,
            completed: false
        };

        tasks.push(newTask);
        return res.status(201).json(newTask);
    }

    // PUT/PATCH - Atualizar tarefa existente
    if (req.method === "PUT" || req.method === "PATCH") {
        const { id } = req.query;
        const { title, completed } = req.body;

        const taskIndex = tasks.findIndex(task => task.id === parseInt(id));
        
        if (taskIndex === -1) {
            return res.status(404).json({ error: "Tarefa não encontrada" });
        }

        if (title !== undefined) {
            tasks[taskIndex].title = title;
        }
        if (completed !== undefined) {
            tasks[taskIndex].completed = completed;
        }

        return res.status(200).json(tasks[taskIndex]);
    }

    // DELETE - Deletar tarefa
    if (req.method === "DELETE") {
        const { id } = req.query;
        const taskIndex = tasks.findIndex(task => task.id === parseInt(id));
        
        if (taskIndex === -1) {
            return res.status(404).json({ error: "Tarefa não encontrada" });
        }

        const deletedTask = tasks.splice(taskIndex, 1)[0];
        return res.status(200).json(deletedTask);
    }

    // Método não permitido
    res.status(405).json({ error: "Método não permitido" });
}
