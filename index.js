const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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
        // await client.connect();
        const addToysCollection = client.db('spkToys').collection('addToys')

        const sandPalToysCollection =client.db('spkToys').collection('sandPalToy')

        // const indexOptions ={name:"toyName"}

        // const result = await addToysCollection.createIndex(indexKye,indexOptions);
        //search
        app.get('/allToySearch/:text',async(req,res)=>{
            const searchToys = req.params.text;
            const result = await addToysCollection.find({toyName:{$regex:searchToys, $options:"i"}})
            .toArray();
            res.send(result)
        })

        //sandPal all Data
        app.get('/sandPalToy', async(req,res) =>{
            const sandPalToy = await sandPalToysCollection.find({}).toArray();
            res.send(sandPalToy)
        })

        app.get('/sandPalToy/:id', async(req,res) =>{
            const id =req.params.id;
            const query = {_id: new ObjectId(id)}
            const result = await sandPalToysCollection.findOne(query)
            res.send(result)
        })

        //addToy
        app.post('/addToy', async(req,res) =>{
            const body = req.body
            if(!body){
                return res.status(401).send('body Data Note Found')
            }
            const addToy = await addToysCollection.insertOne(body)
            res.send(addToy)
            console.log(addToy)
        })

        //All Toys
        app.get('/allToys', async (req,res) =>{
            const allToys = await addToysCollection.find({}).toArray();
            res.send(allToys)
        })  
        //myToy
        app.get('/myToy/:email', async(req,res)=>{
            console.log(req.params.email)
            const myToy = await addToysCollection.find({sellerEmail: req.params.email}).toArray()
            res.send(myToy)
        })

          app.get("/ass/:email", async (req, res) => {
            const result = await addToysCollection.find({sellerEmail: req.params.email}).sort( {price: 1} ).toArray();
            res.send(result);
          });
          app.get("/des/:email", async (req, res) => {
            const result = await addToysCollection.find({sellerEmail: req.params.email}).sort( {price: -1} ).toArray();
            res.send(result);
          });
      
        app.get('/allToys/:id',async(req,res) =>{
            const id = req.params.id;
            const query = {_id: new ObjectId(id)}
            const result = await addToysCollection.findOne(query)
            res.send(result)
          })

        app.patch('/allToys/:id',async(req,res) =>{
            const id =req.params.id;
            const filter={_id:new ObjectId(id)}
            const options = {upsert:true}
            const updateToy = req.body;
            const Toy = {
                $set:{
                    Rating: updateToy.Rating,
                    description:updateToy.description,
                    photoURL:updateToy.photoURL,
                    price:updateToy.price,
                    toyName:updateToy.toyName,
                    quantity:updateToy.quantity
                }
            }
            const result = await addToysCollection.updateOne(filter,Toy,options)
            res.send(result)

        })
        app.delete('/myToy/:id', async(req,res) =>{
            const id = req.params.id;
            console.log(id)
          
            const query = {_id: new ObjectId(id)}
            const result = await addToysCollection.deleteOne(query)
            res.send(result)
      
          })

        // Send a ping to confirm a successful connection
         client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // await client.close();
    }
}
run().catch(console.dir);

app.listen(port, () => {
    console.log('port console is running')
})