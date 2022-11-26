//app.js
const {MongoClient, ObjectId} = require("mongodb");
async function connect(){
  if(global.db) return global.db;
  const conn = await MongoClient.connect("mongodb+srv://Robson:Portugal23!@cluster0.4w4rxc8.mongodb.net/?retryWrites=true&w=majority");
  if(!conn) return new Error("Can't connect");
  global.db = await conn.db("store");
  return global.db;
}

const express = require('express');
const app = express();         
const port = 3000; //porta padrão

//app.use(require('cors')());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//definindo as rotas
const router = express.Router();

router.get('/', (req, res) => res.json({ message: 'Funcionando!' }));

/* GET produtos - consultar produtos da loja virtual */
router.get('/produtos/:id?', async function(req, res, next) {
    try{
      const db = await connect();
      if(req.params.id)
        res.json(await db.collection("products").findOne({_id: new ObjectId(req.params.id)}));
      else
        res.json(await db.collection("products").find().toArray());
    }
    catch(ex){
      console.log(ex);
      res.status(400).json({erro: `${ex}`});
    }
})

// POST /produtos - acrescentar produtos na loja virtual
router.post('/produtos', async function(req, res, next){
    try{
      const product = req.body;
      const db = await connect();
      res.json(await db.collection("products").insertOne(product));
    }
    catch(ex){
      console.log(ex);
      res.status(400).json({erro: `${ex}`});
    }
})

// PUT /produtos/{id} - editar produtos da loja
router.put('/produtos/:id', async function(req, res, next){
    try{
      const product = req.body;
      const db = await connect();
      res.json(await db.collection("products").updateOne({_id: new ObjectId(req.params.id)}, {$set: product}));
    }
    catch(ex){
      console.log(ex);
      res.status(400).json({erro: `${ex}`});
    }
})

// DELETE /produtos/{id}
router.delete('/produtos/:id', async function(req, res, next){
    try{
      const db = await connect();
      res.json(await db.collection("products").deleteOne({_id: new ObjectId(req.params.id)}));
    }
    catch(ex){
      console.log(ex);
      res.status(400).json({erro: `${ex}`});
    }
})

app.use('/', router);

//inicia o servidor
app.listen(port);
console.log('API funcionando!');
