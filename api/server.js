const jsonServer = require('json-server');
const fs = require('fs');
const path = require('path');

const server = jsonServer.create();

const filePath = path.join(__dirname, 'db.json');
const data = fs.readFileSync(filePath, "utf-8");
const db = JSON.parse(data);
const router = jsonServer.router(db);

const middlewares = jsonServer.defaults();

server.use((req, res, next) => {
    // Configurar CORS com origins múltiplos
    const allowedOrigins = [
        'https://task-manager-phi-jade-95.vercel.app',
        'http://localhost:3000',
        'http://localhost:5173',
        'http://localhost:3001'
    ];

    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
        res.header('Access-Control-Allow-Origin', origin);
    }

    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.header('Access-Control-Allow-Credentials', 'true');

    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }

    next();
});

server.use(middlewares);
server.use(
    jsonServer.rewriter({
        '/api/*': '/$1',
    })
);
server.use(router);

// A linha listen não é necessária no Vercel
// server.listen(3000, () => {
//     console.log('JSON Server is running');
// });

module.exports = server;
