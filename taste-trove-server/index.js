const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express()
const port = process.env.PORT || 3000

// app.use(cors({
//   origin:['http://localhost:5173/', 'https://grand-jelly-06773e.netlify.app/', "https://forest-canvas-server-3h55by99a-wasim-hossains-projects.vercel.app"]
// }))
const corsOptions = {
  origin: "*",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS" ],
  allowedHeaders:["Content-Type"]
};

app.use(cors(corsOptions));
app.options("*",cors(corsOptions))
app.use(express.json())


// const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.db_user}:${process.env.db_pass}@cluster0.r95emnj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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

    const UserFoodDataCollection = client.db('foodDataDB').collection('foods')
    const GalleryDataCollection = client.db('galleryDataDB').collection('userChoice')
    const PurchasesDataCollection = client.db('purchaseDataDB').collection('purchase')

    app.get('/foods', async(req, res)=>{
      const cursor = UserFoodDataCollection.find()
      const result = await cursor.toArray()
      res.send(result)
   
    })

 

    app.get('/userChoice', async (req, res) => {
      const cursor = GalleryDataCollection.find();
      const result = await cursor.toArray();
      res.send(result);
  })

    app.get('/purchases', async (req, res) => {
      const cursor = PurchasesDataCollection.find();
      const result = await cursor.toArray();
      res.send(result);
  })

  app.delete('/purchases/:id',async(req, res)=>{
    const id = req.params.id;
    const query = {_id: new ObjectId(id)}
    const result = await PurchasesDataCollection.deleteOne(query)
    res.send(result)
  })
  app.delete('/foods/:id',async(req, res)=>{
    const id = req.params.id;
    const query = {_id: new ObjectId(id)}
    const result = await UserFoodDataCollection.deleteOne(query)
    res.send(result)
  })

  app.get('/foods/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await UserFoodDataCollection.findOne(query);
      res.send(result);
  })

  app.put('/foods/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) }
      const options= {upsert: true}
      const updateFoodInfo = req.body
      const upFoodData ={
        $set:{
          FoodName:updateFoodInfo.FoodName,
          FoodCategory:updateFoodInfo.FoodCategory,
          shortDescription:updateFoodInfo.shortDescription, 
          price:updateFoodInfo.price, 
          countryName:updateFoodInfo.countryName, 
          quantity:updateFoodInfo.quantity, 
          userEmail:updateFoodInfo.userEmail, 
          userName:updateFoodInfo.userName, 
          photoUrl: updateFoodInfo.photoUrl
        }
      }
      const result = await UserFoodDataCollection.updateOne(filter, upFoodData);
      res.send(result);
  })


    app.post('/foods', async(req, res)=>{
      const foodData = req.body;
      // console.log(foodData);
      const result = await UserFoodDataCollection.insertOne(foodData)
      res.send(result)
    })
    
    app.post('/userChoice', async(req, res)=>{
      const galleryData = req.body;
      // console.log(foodData);
      const result = await GalleryDataCollection.insertOne(galleryData)
      res.send(result)
    })
    app.post('/purchases', async(req, res)=>{
      const purchasesData = req.body;
      // console.log(foodData);
      const result = await PurchasesDataCollection.insertOne(purchasesData);
      res.send(result)
    })

    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Hello World!')
  })
  
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })