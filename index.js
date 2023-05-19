const express = require("express");
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express()
require("dotenv").config()
const port = process.env.PORT || 5000
const cors = require('cors')

app.use(express.json())
app.use(cors())


app.get('/', (req, res) => {
    res.send('spk server is running')
})


const uri = `mongodb+srv://${process.env.DB_NAME}:${process.env.DB_PASS}@cluster0.nlw4swl.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        const addToysCollection = client.db('spkToys').collection('addToys')

        const sandPalToysCollection =client.db('spkToys').collection('sandPalToy')

        app.get('/sandPalToy', async(req,res) =>{
            const sandPalToy = await sandPalToysCollection.find({}).toArray();
            res.send(sandPalToy)
        })

        app.post('/addToy', async(req,res) =>{
            const body = req.body
            if(!body){
                return res.status(401).send('body Data Note Found')
            }
            const addToy = await addToysCollection.insertOne(body)
            res.send(addToy)
            console.log(addToy)
        })


        app.get('/allToys', async (req,res) =>{
            const allToys = await addToysCollection.find({}).toArray();
            res.send(allToys)
        })

        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);

app.listen(port, () => {
    console.log('port console is running', port)
})