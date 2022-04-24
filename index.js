const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// middleware
app.use(express.json())
app.use(cors());

// connect to database
// redOnion
// 55qVME9CtylPZM8G


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.MONGO_DB_USER}:${process.env.MONGO_DB_PASS}@cluster0.twvnf.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
    try {
        await client.connect();
        const productsCollection = client.db('redOnion').collection('products');
        console.log('Database Connected');

        // get all products
        app.get('/products', async(req, res) => {
            const cursor = productsCollection.find({});
            const result = await cursor.toArray();
            res.send(result);
        });
        // post product
        app.post('/product', async(req, res) => {
            const product = req.body;
            console.log(product);
            const result = await productsCollection.insertOne(product);
            res.send(result);
        })
        // delete product
        app.delete('/product/:id', async(req, res) => {
            const id = req.params.id;
            const result = await productsCollection.deleteOne({_id: ObjectId(id)})
            res.send(result);
        })
        // update product
        app.put('/product/:id', async(req, res) => {
            const id = req.params.id;
            const data = req.body
            const updateDoc = {
                $set: data
            }
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const result = await productsCollection.updateOne(filter, updateDoc, options);
            res.send(result)
        })
    }
    finally {

    }
}
run().catch(console.dir);


const port = process.env.PORT || 5000;

// root get
app.get('/', (req, res) => {
    res.send('This is red onion server');
})

// listen the app
app.listen(port, (req, res) => {
    console.log('Red onion server is running on port:', port);
})