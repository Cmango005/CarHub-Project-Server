const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;
const brands = [
  {
    id: 1, img: "https://i.ibb.co/wMmVwc1/BMW-M-Cars.jpg", brand: "BMW"
  },
  {
    id: 2, img: "https://i.ibb.co/W2TR9Bw/1-Mercedes-CLE-Coupe.jpg", brand: "MERCEDES-BENZ"
  },
  {
    id: 3, img: "https://i.ibb.co/mD0HRRg/hyundai-elantra-2024-1-768.jpg", brand: "HYUNDAI"
  },
  {
    id: 4, img: "https://i.ibb.co/tC3Y4KG/cf576b3f-cbc1-4d4c-87ae.webp", brand: "FERRARI"
  },
  {
    id: 5, img: "https://i.ibb.co/NpMwvd0/autentica-cover-m.jpg", brand: "LAMBORGHINI"
  },
  {
    id: 6, img: "https://i.ibb.co/txPP6y7/2015-koenigsegg-one1-first-drive-review-car-and-driver-photo-654233-s-original.jpg", brand: "KOENIGSEGG"
  }
]
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.h0tacow.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri)

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
    const productCollection = client.db("brandDB").collection("products");
    const userCollection = client.db("brandDB").collection("user");

    app.get('/products', async (req, res) => {
      const cursor = productCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    app.get('/products/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await productCollection.findOne(query);
      res.send(result);
    })

    app.post('/products', async (req, res) => {
      const newProduct = req.body;
      console.log(newProduct);
      const result = await productCollection.insertOne(newProduct);
      res.send(result)
    })
    app.put('/products/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const newUpdate = req.body;
      const product = {
        $set: {
          name: newUpdate.name,
          brand: newUpdate.brand,
          photo: newUpdate.photo,
          price: newUpdate.price,
          description: newUpdate.description,
          type: newUpdate.type,
          rating: newUpdate.rating
        }
      }
      const result = await productCollection.updateOne(filter, product, options);
      res.send(result)
    })
    app.get('/user', async (req, res) => {
      const cursor = userCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })
    app.post('/user', async (req, res) => {
      const user = req.body;
      const result = await userCollection.insertOne(user);
      res.send(result);
    })
    app.patch('/user/:id', async (req, res) => {
      const id = req.params.id;
      const user = req.body;
      console.log(user);
      const filter = { _id: new ObjectId(id) };
      const updatedDoc = {
        $set: {
          Cart: user.Cart
        }
      };
      const result = await userCollection.updateOne(filter, updatedDoc);
      res.send(result);

    });


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    //await client.close();
  }
}
run().catch(console.dir);


app.get("/", (req, res) => {
  res.send(brands);
})
app.listen(port, () => {
  console.log(`brand server is running at port : ${port}`)
})