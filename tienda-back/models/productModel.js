import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true, unique: true },
    ficha: { type: String, required: true, unique: true },
    categoria: { type: String, required: true },
    imagen: { type: String, required: true },
    precio: { type: Number, required: true },
    disponibles: { type: Number, required: true },
    marca: { type: String, required: true },
    descripcion: { type: String, required: true },
  },
  {
    timestamps: true, //añade 2 campos (fecha creación y feccha de actualización)
  }
);

const Product = mongoose.model('Product', productSchema);
export default Product;
