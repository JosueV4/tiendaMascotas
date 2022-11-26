import express from 'express';
import Product from '../models/productModel.js';

const productRouter = express.Router();

productRouter.get('/', async (req, res) => {
  const productos = await Product.find();
  res.send(productos);
});

productRouter.get('/ficha/:ficha', async(req, res) => {
  const product = await Product.findOne({ficha:req.params.ficha});
  if (product) {
    res.send(product);
  } else {
    res.status(404).send({ message: 'Producto no encontrado' });
  }
});
productRouter.get('/:id', async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    res.send(product);
  } else {
    res.status(404).send({ message: 'Product Not Found' });
  }
});

export default productRouter;