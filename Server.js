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

const startServer = async () => {
    await server.start();
};

pp.get('/api', (req, res) => {
    const path = `/api/item/${v4()}`;
    res.setHeader('Content-Type', 'text/html');
    res.setHeader('Cache-Control', 's-max-age=1, stale-while-revalidate');
    res.end(`Hello! Go to item: <a href="${path}">${path}</a>`);
  });
  
  app.get('/api/item/:slug', (req, res) => {
    const { slug } = req.params;
    res.end(`Item: ${slug}`);
  });

startServer()
    .then(() => {
        server.applyMiddleware({app});
        console.log("Serveur appolo demarré")})
    .catch(() => {console.log("Echec demarrage appolo")})

    .finally(() => {app.listen(PORT,() => {
    console.log("Listening ... ");
})})

module.exports = app