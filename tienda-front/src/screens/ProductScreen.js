import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { useContext, useEffect, useReducer } from 'react';
import { Row, Col, ListGroup, Button, Card, Badge } from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';
import { Store } from '../Store';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, product: action.payload, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

function ProductScreen() {
  const navigate = useNavigate();
  const params = useParams();
  const { ficha } = params;

  const [{ loading, error, product }, dispatch] = useReducer(reducer, {
    product: [],
    loading: true,
    error: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const result = await axios.get(`/api/productos/ficha/${ficha}`);
        dispatch({ type: 'FETCH_SUCCESS', payload: result.data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: err.message });
      }
    };
    fetchData();
  }, [ficha]);

//Add product to card
const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart } = state;
  const addToCartHandler = async () => {
    const existItem = cart.cartItems.find((x) => x._id === product._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`/api/productos/${product._id}`);
    if (data.disponibles < quantity) {
      window.alert('El producto no esta disponible');
      return;
    }
    ctxDispatch({
      type: 'CART_ADD_ITEM',
      payload: { ...product, quantity},
    });
    navigate('/cart');  //REdirigir a la pestaña del carrito de compras
  };

  return loading ? (
    <div>Loading...</div>
  ) : error ? (
    <div>{error}</div>
  ) : (
    <div>
      <h1>{ficha}</h1>
      <Row>
        <Col md={6}>
          <img
            className="img-large"
            src={product.imagen}
            alt={product.nombre}
          ></img>
        </Col>
        <Col md={3}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <Helmet>
                <title>{product.nombre}</title>
              </Helmet>
            </ListGroup.Item>
            <ListGroup.Item>Precio : ${product.precio}</ListGroup.Item>
            <ListGroup.Item>
              Descripcion:
              <p>{product.descripcion}</p>
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={3}>
          <Card>
            <Card.Body>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <Row>
                    <Col>Precio:</Col>
                    <Col>${product.precio}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Estado:</Col>
                    <Col>
                      {product.disponibles > 0 ? (
                        <Badge bg="success">Disponible</Badge>
                      ) : (
                        <Badge bg="danger">No Disponible</Badge>
                      )}
                    </Col>
                  </Row>
                </ListGroup.Item>

                {product.disponibles > 0 && (
                  <ListGroup.Item>
                    <div className="d-grid">
                      <Button onClick={addToCartHandler} variant="primary">
                        Añadir al Carrito
                      </Button>
                    </div>
                  </ListGroup.Item>
                )}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default ProductScreen;
