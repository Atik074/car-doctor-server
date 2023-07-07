const express = require('express')
const app = express()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const port = process.env.PORT || 5000
const cors = require('cors')

// midleware
app.use(cors())
app.use(express.json())



 const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.flztkm6.mongodb.net/?retryWrites=true&w=majority`;

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
    
    const servicesCollection = client.db("carDoctor").collection("services");

    // carDoctor ar undare  manush j sob service order korbe sei sob data mongodb te store kore rakhte hbe.tai notun collection toiry korte hobe.
    const bookingCollection = client.db('carDoctor').collection('bookings')


    app.get('/services', async(req, res)=>{
      const cursor = servicesCollection.find();
      const result = await cursor.toArray()
       res.send(result)
    })

    app.get('/services/:id' , async(req, res)=>{
      const id = req.params.id 
      const query = {_id : new ObjectId(id)}
   const options = {
     // Include only the `title` and `imdb` fields in the returned document
        projection: {  title: 1, price:1 ,service_id:1 , img:1},
      };

      const result = await servicesCollection.findOne(query,options)
      res.send(result)
    })

    // bookings ........

  //   all data  is not needed and specific one data is not needed. some  data  will  be needed .for this :
  app.get('/bookings' , async(req,res)=>{
    console.log(req.query.email)
    let query = {};  
    if(req.query?.email){
      query = {email : req.query.email}
    }
    const result = await bookingCollection.find().toArray()
      res.send(result) 
  })



  // booking data created
    app.post('/bookings' , async(req, res)=>{
       const booking = req.body 
       console.log(booking)
       const doc ={
        CustomerName :booking. name ,
              service:booking.title,
             service_id:booking._id ,
            number :booking.number ,
            date :booking.date ,
            price :booking.price
       }
       const result = await bookingCollection.insertOne(doc)
       res.send(result)

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








app.get("/", (req, res) => {
  res.send('car doctor running')
})

app.listen(port, () => {
  console.log(`port running  on ${port}`)
})