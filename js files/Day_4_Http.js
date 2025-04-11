// const http = require('http');

// const server = http.createServer((req, res) => {
//     res.end('Hello, World!');
// });

// server.listen(3000, () => {
//     console.log('Server running on port 3000');
// });








// import express from "express";
// const app = express();
// app.use(express.json());
// let users = [];
// app.get("/users", (req, res) => res.json(users));
// app.post("/users", (req, res) => {
//   users.push(req.body);
//   res.status(201).send("User added");
// });
// app.delete("/users/:id", (req, res) => {
//   users = users.filter((u) => u.id !== req.params.id);
//   res.send("User deleted");
// });

// app.listen(3000, () => console.log("API running on 3000"));



// import express from "express";
// const app = express();

// app.use(express.json()); 

// app.get('/error', (req, res, next) => {
//     const error = new Error("Something went wrong!");
//     error.status = 500; // Internal Server Error
//     next(error); // Pass error to middleware
// });
 
// // err handling Middleware
// app.use((err, req, res, next) => {
//     res.status(err.status || 500).json({
//         message: err.message || "Internal Server Error"
//     });
// });
// app.use((req, res, next) => {
//     console.log(`${req.method} ${req.url}`);
//     next();
// });


// app.listen(3000, () => console.log("Server running on port 3000"));






import http from 'http';
const options = { hostname: 'jsonplaceholder.typicode.com', path: '/posts/1', method: 'GET' };
const req = http.request(options, res => {
    res.on('data', data => console.log(data.toString()));
});
req.end();

