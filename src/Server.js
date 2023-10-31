const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { ApolloServer} = require('apollo-server-express');
const schema = require('./schema');


const corsOptions = {
    origin: "*",
    credentials: true
}

const app = express();
const PORT = process.env.DEV_PORT;
const server = new ApolloServer({schema,cors: corsOptions})
app.use(cors(corsOptions))
app.get('/',(req,res) => {
    res.json("Backend Fonctionnel")
})

const startServer = async () => {
    await server.start();
};


startServer()
    .then(() => {
        server.applyMiddleware({app});
        console.log("Serveur appolo demarré")})
    .catch(() => {console.log("Echec demarrage appolo")})

    .finally(() => {app.listen(PORT,() => {
    console.log("Listening ... ");
})})
