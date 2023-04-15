import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Store } from "../Store";
import { Helmet } from "react-helmet-async";
import axios from "axios";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import ListGroup from "react-bootstrap/ListGroup";
import Card from "react-bootstrap/Card";

export default function CartScreen() {
  const navigate = useNavigate();
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    cart: { cartItems },
  } = state;

  const updateCart = async (item, quantity) => {
    const { data } = await axios.get(`/api/products/${item._id}`);
    if (data.countInStock < quantity) {
      window.alert("Sorry. Product is out of stock");
      return;
    }
    ctxDispatch({
      type: "CART_ADD_ITEM",
      payload: { ...item, quantity },
    });
  };

  const removeItem = (item) => {
    ctxDispatch({ type: "CART_REMOVE_ITEM", payload: item });
  };

  const checkoutHandler = () => {
    //check if authenticated or authorized
    navigate("/signin?redirect=/confirm");
  };
  return (
    <div className='bg-gray-100 py-6'>
      <Helmet>
        <title>My Cart</title>
      </Helmet>
      <h1 className='text-3xl font-bold text-gray-800 text-center mb-8'>
        Shopping Cart
      </h1>
      <Row>
        <Col md={8}>
          {cartItems.length === 0 ? (
            <h1 className='text-2xl font-semibold text-gray-700 text-center'>
              Cart is Empty.{" "}
              <Link className='text-blue-600 hover:text-blue-800' to='/'>
                Lets Shop
              </Link>
            </h1>
          ) : (
            <ListGroup className='bg-white shadow overflow-hidden rounded-md'>
              {cartItems.map((item) => (
                <ListGroup.Item key={item._id} className='border-b py-4 px-6'>
                  <div className='flex items-center'>
                    <div className='w-25 h-25 mr-6'>
                      <img
                        src={item.image}
                        alt={item.name}
                        className='object-cover rounded'
                      />
                    </div>
                    <div className='flex-1'>
                      <h2 className='text-lg font-semibold'>{item.name}</h2>
                      <div className='flex items-center mt-1'>
                        <button
                          className='bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-1 px-2 rounded-full mr-2'
                          onClick={() => updateCart(item, item.quantity - 1)}
                          disabled={item.quantity === 1}
                        >
                          <i className='fas fa-minus-circle'></i>
                        </button>
                        <span className='text-gray-700'>{item.quantity}</span>
                        <button
                          className='bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-1 px-2 rounded-full ml-2'
                          onClick={() => updateCart(item, item.quantity + 1)}
                          disabled={item.quantity === item.countInStock}
                        >
                          <i className='fas fa-plus-circle'></i>
                        </button>
                      </div>
                    </div>
                    <div className='flex items-center ml-auto'>
                      <p className='text-lg font-semibold text-gray-700'>
                        ${item.price}
                      </p>
                      <button
                        className='ml-4 text-gray-600 hover:text-red-600'
                        onClick={() => removeItem(item)}
                      >
                        <i className='fas fa-trash '></i>
                      </button>
                    </div>
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Col>
        <Col md={4}>
          <Card>
            <Card.Body>
              <ListGroup className='bg-white shadow overflow-hidden rounded-md'>
                <ListGroup.Item>
                  <h3 className='text-lg leading-6 font-medium text-gray-900 mb-4'>
                    <p className='text-sm text-gray-500'>Subtotal</p>
                    <p className='text-gray-800 font-semibold'>
                      ({cartItems.reduce((a, c) => a + c.quantity, 0)} items)
                    </p>{" "}
                    <p className='text-gray-800 font-semibold'>
                      {cartItems.reduce((a, c) => a + c.price * c.quantity, 0)}
                    </p>
                  </h3>
                </ListGroup.Item>
                <ListGroup.Item>
                  <div className='d-grid'>
                    <button
                      onClick={checkoutHandler}
                      class='bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
                      type='button'
                      disabled={cartItems.length === 0}
                    >
                      Checkout
                    </button>
                  </div>
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
