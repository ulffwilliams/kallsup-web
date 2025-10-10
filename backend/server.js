//UTAN Express

/* import http from "http";
import { gigs } from "./gigs.js"
const server = http.createServer((req, res) => {
    if(req.method === "GET" && req.url === "/gigs") {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(gigs));
    } else if (req.method === "POST" && req.url === "/shutdown") {
        res.writeHead(200, { "Content-Type": "text/plain" });
        res.end("Server shutting down...");
        server.close(() => {
            console.log("Server closed.");
            process.exit(0);
        });
    } else {
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.end(JSON.stringify({ message: "Not Found" }));
    }
});

server.listen(3000,() => {
    console.log("Server listening on port http://localhost:3000");
})

 */


//Express LUL

const express = require('express');

const { gigs } = require('./gigs.js');
const server = express();

server.use(express.json());

server.post("/gigs", (req, res) => {
    const newGig = req.body;
    newGig.id = gigs.length;
    gigs.push(newGig);
    res.json({ message: "New gig added", gig: newGig });
});

server.put("/gigs/:id", (req, res) => {
    const id = Number(req.params.id);
    const item = gigs.find(gig => gig.id === id);
    if(!item){
        res.status(404).json({ message: "Gig not found" });
    } else {
        Object.assign(item, req.body);
        res.json({ message: "Gig updated", item });
    }
})

server.get("/gigs", (req, res) => {
    res.json(gigs);
});

server.delete("/gigs/:id", (req, res) => {
    const id = Number(req.params.id);
    const index = gigs.findIndex(gig => gig.id === id);
    if(index === -1){
        res.status(404).json({ message: "Gig not found" });
    } else {
        const deletedGig = gigs.splice(index, 1)[0];
        res.json({ message: "Gig deleted", gig: deletedGig });
    }
});

server.listen(3000, () => {
    console.log("Server listening on port http://localhost:3000");
});