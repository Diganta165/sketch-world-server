const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient;
const cors = require('cors')
const bodyParser = require('body-parser')
require('dotenv').config()

const port = process.env.port || 5055;

app.use(cors());
app.use(bodyParser.json());



app.get('/', (req, res) => {
  res.send('Hello World!')
})



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.7q9be.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    console.log('connection err',err)
  const sketchCollection = client.db("sketch-world").collection("sketches");
  const ordersCollection = client.db("sketch-world").collection("orders");
  
  app.get('/sketches',(req, res)=>{
      sketchCollection.find()
      .toArray((err, items)=>{
          res.send(items)
        //   console.log('from database',items)
      })
  })

//   app.get('/')
  

  app.post('/admin',(req, res)=>{
      const newSketch =req.body;
      console.log('adding new Sketch: ', newSketch)
      sketchCollection.insertOne(newSketch)
      .then(result => {
          console.log('inserted count',result.insertedCount)
          res.send(result.insertedCount > 0)
      })
  })

  //adding ordered data in the db
  app.post('/addOrder',(req, res)=>{
      const order =req.body;
      
      ordersCollection.insertOne(order)
      .then(result => {
          
          res.send(result.insertedCount > 0)
      })
  })
  app.get('/orders', (req, res) => {
    ordersCollection.find({email: req.query.email})
    .toArray((err, data) => {
      res.send(data);
    })
  })
  
//   client.close();
});




app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})