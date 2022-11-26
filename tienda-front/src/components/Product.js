import axios from 'axios';
import { useContext } from 'react';
import { Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Store } from '../Store';

function Product(props) {
  const { product } = props;

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    cart: { cartItems },
  } = state;

  const addToCartHandler = async (item) => {
    const existItem = cartItems.find((x) => x._id === product._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`/api/productos/${item._id}`);
    if (data.disponibles < quantity) {
      window.alert('Producto no disponible');
      return;
    }
    ctxDispatch({
      type: 'CART_ADD_ITEM',
      payload: { ...item, quantity },
    });
  };

  return (
    <Card>
      <Link to={`/product/${product.ficha}`}>
        <img
          src={product.imagen}
          className="card-img-top"
          alt={product.nombre}
        />
      </Link>
      <Card.Body>
        <Link to={`/product/${product.ficha}`}>
          <Card.Title>{product.nombre}</Card.Title>
        </Link>
        <Card.Text>${product.precio}</Card.Text>
        {product.disponibles === 0 ? (
          <Button variant="light" disabled>
            Producto Agotado
          </Button>
        ) : (
          <Button onClick={() => addToCartHandler(product)}>Añadir al Carrito</Button>
        )}
      </Card.Body>
    </Card>
  );
}
export default Product;
