/* eslint-disable no-undef */

// mongodb created need to connect app to db
// must install express to work. 
// must have node.js installed
// good idea to install nodemon for dev
// must run this file in a separate terminal / vite serving local 5731 /server serving local 3000
// can use postman (separate application) for development as well

// to run open up a separate terminal and use nodemon ./server/mongo.js or node ./server/mongo.js if nodemon is not installed 


import express from 'express'
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
import { auth } from 'express-oauth2-jwt-bearer';
import { fileURLToPath } from 'url';
import path from 'path';

dotenv.config({ path: './.env' });

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();

const cs = process.env.MONGODB_URL;
if (!cs) throw new Error("MONGODB_URL is not defined");

const client = new MongoClient(cs);
const database = client.db('pantrycook');
const collections = database.collection("users");
const errorLogs = database.collection("errorLogs");

const checkJwt = auth({
    audience: process.env.AUTH0_AUDIENCE,
    issuerBaseURL: process.env.ISSUER_BASE_URL,
    //if secret is in env file will require a sign token. Remove the secret!
})

app.use(function(req, res, next){ //cors
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods',
    'GET,PUT,POST,PATCH,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers',
    'Content-Type, Authorization, Content-Length, X-Requested-With');
    if (req.method === "OPTIONS") res.sendStatus(200);
    else next();
});

app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded


app.post('/user', checkJwt, async (req, res) => { //add user to db

    try {
        const email = req.auth.payload.email;
        const existingUser = await collections.findOne({ email });
        if (existingUser) {
            return res.status(200).send({ created: false, ...existingUser });
        }

        const newUser = {
            email,
            recipes: [],
        };

        const result = await collections.insertOne(newUser);
        res.status(201).send({ _id: result.insertedId, ...newUser });
    } catch (e) {
        console.error(e);
        res.status(500).send({ error: 'Internal server error' });
    }
});

app.get('/user', checkJwt, async (req, res) => { //returns all user information including saved recipes

    try {
        const email = req.auth.payload.email;
        const result = await collections.findOne({ email });
        if (!result) return res.sendStatus(404);
        res.status(200).send(result);
    } catch (e) {
        console.error(e);
        res.status(500).send({ error: 'Internal server error' });
    }
});

app.put('/recipe', checkJwt, async (req, res) => { //add new recipe to saved recipes
    try {
    const email = req.auth.payload.email;
    if (!req.body.recipe) return res.status(400).send({ error: 'Recipe is required' });

    const result = await collections.updateOne(
      { email },
      { $push: { recipes: req.body.recipe } }  // ← appends single recipe
    );
    if (result.modifiedCount === 0) return res.sendStatus(404);
    res.status(200).send(result);
  } catch (e) {
    console.error(e);
    res.status(500).send({ error: 'Internal server error' });
  }
});

app.delete('/recipe', checkJwt, async (req, res) => {
    try {
        const email = req.auth.payload.email;
        if (!req.body.recipeId) return res.status(400).send({ error: 'recipeId is required' });

        const result = await collections.updateOne(
        { email },
        { $pull: { recipes: { id: req.body.recipeId } } }
        );
        if (result.modifiedCount === 0) return res.sendStatus(404);
        res.status(200).send({ message: 'Recipe deleted successfully' });
    } catch (e) {
        console.error(e);
        res.status(500).send({ error: 'Internal server error' });
    }
});


// Serve the built Vite frontend as static files
app.use(express.static(path.join(__dirname, '../dist')));

// Catch-all for React Router — must be last so /history, /saved, etc. work
app.get('/{*splat}', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
});

async function startServer() {
    await client.connect();
    console.log('Connected to MongoDB');
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
}

startServer().catch(console.error);