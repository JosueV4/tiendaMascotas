import express from 'express';
import data from './data.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv'; 
import seedRouter from './routes/seedRoutes.js';
import productRouter from './routes/productRoutes.js';
import userRouter from './routes/userRoutes.js';

//Dependencia para ejecutar variables en el .env file
dotenv.config();

//Conexión mongoDB
mongoose.connect(process.env.MONGODB_URI).then(() =>{
    console.log('conectado a la base de datos')
}).catch(err => {
    console.log(err.message)
});

//Servidor local
const app = express();

//Datos de formulario convertidos a jsonObject en rec.body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/seed', seedRouter);
app.use('/api/productos', productRouter);
app.use('/api/users', userRouter);

//Controlador de errores con express middleware
app.use((err, req, res, next) => {
  res.status(500).send({ message: err.message });
});

//Servidor local express
const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`serve at http://localhost:${port}`);
});