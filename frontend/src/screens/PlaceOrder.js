import React, { useContext, useEffect, useReducer } from "react";
import OrderSteps from "../components/OrderSteps";
import { Helmet } from "react-helmet-async";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Store } from "../Store";
import { toast } from "react-toastify";
import { getError } from "../utils";
import Axios from "axios";
import LoadingBox from "../components/LoadingBox";

const reducer = (state, action) => {
  switch (action.type) {
    case "CREATE_REQUEST":
      return { ...state, loading: true };
    case "CREATE_SUCCESS":
      return { ...state, loading: false };
    case "CREATE_FAIL":
      return { ...state, loading: false };
    default:
      return state;
  }
};

export default function PlaceOrder() {
  const navigate = useNavigate();
  const [{ loading }, dispatch] = useReducer(reducer, {
    loading: false,
  });

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart, userInfo } = state;

  const round = (num) => Math.round(num * 100, Number.EPSILON) / 100;
  cart.totalPrice = round(
    cart.cartItems.reduce((a, c) => a + c.quantity * c.price, 0)
  );

  const placeOrderHandler = async () => {
    try {
      dispatch({ type: "CREATE_REQUEST" });
      for (const item of cart.cartItems) {
        const { data } = await Axios.put(
          `/api/products/${item._id}/update-stock`,
          {
            countInStock: item.countInStock - item.quantity,
          },
          {
            headers: {
              authorization: `Bearer ${userInfo.token}`,
            },
          }
        );
        console.log(data);
      }
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + 2);

      const { data } = await Axios.post(
        "/api/orders",
        {
          orderItems: cart.cartItems,
          customerDetails: cart.customerDetails,
          totalPrice: cart.totalPrice,
          expiryDate: expiryDate,
        },
        {
          headers: {
            authorization: `Bearer ${userInfo.token}`,
          },
        }
      );
      console.log(data.data);

      ctxDispatch({ type: "CART_CLEAR" });
      dispatch({ type: "CREATE_SUCCESS" });
      localStorage.removeItem("cartItems");
      navigate(`/order/${data.order._id}`);
    } catch (err) {
      dispatch({ type: "CREATE_FAIL" });
      toast.error(getError(err));
    }
  };

  return (
    <div>
      <OrderSteps step1 step2 step3></OrderSteps>
      <h1 className='text-3xl font-bold text-gray-800 text-center mb-8'>
        Oder Details
      </h1>
      <Helmet>Place Order</Helmet>
      <Row>
        <Col md={8}>
          <Card className='mb-3 bg-white shadow-lg rounded-lg'>
            <Card.Body className='p-4'>
              <Card.Title className='text-2xl font-bold mb-4'>
                Customer Details
              </Card.Title>
              <Card.Text className='text-gray-600'>
                <div className='flex items-center mb-2'>
                  <strong className='mr-2'>Name:</strong>
                  <span>{cart.customerDetails.fullName}</span>
                </div>
                <div className='flex items-center mb-2'>
                  <strong className='mr-2'>Phone Number:</strong>
                  <span>{cart.customerDetails.phoneNo}</span>
                </div>
                <div className='flex items-center mb-2'>
                  <strong className='mr-2'>Course:</strong>
                  <span>{cart.customerDetails.course}</span>
                </div>
                <div className='flex items-center'>
                  <strong className='mr-2'>Address:</strong>
                  <span>{cart.customerDetails.address}</span>
                </div>
              </Card.Text>
              <Link
                to='/confirm'
                className='mt-4 text-blue-500 hover:text-blue-700'
              >
                Edit Details
              </Link>
            </Card.Body>
          </Card>
          <Card className='mb-3'>
            <Card.Body>
              <Card.Title className='text-2xl font-bold mb-4'>
                Product Details
              </Card.Title>
              <ListGroup className='bg-white shadow overflow-hidden rounded-md'>
                {cart.cartItems.map((item) => (
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
                        <h1 className='text-lg font-semibold'>{item.name}</h1>
                        <div className='flex items-center mt-1'></div>
                        <span className='text-sm md:text-base'>
                          {item.quantity}
                        </span>
                      </div>
                      <div className='md:w-1/5 text-center md:text-right'>
                        <span className='text-lg font-medium'>
                          {item.price}
                        </span>
                      </div>
                    </div>
                  </ListGroup.Item>
                ))}
              </ListGroup>
              <Link
                to='/cart'
                className='mt-4 text-blue-500 hover:text-blue-700'
              >
                Edit Details
              </Link>
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Card className='border border-gray-200 rounded-lg shadow-md'>
            <Card.Body>
              <Card.Title className='text-xl font-bold mb-4'>
                Order Summary
              </Card.Title>
              <ListGroup>
                <ListGroup.Item className='flex justify-between items-center'>
                  <span>Order Total</span>
                  <span className='text-green-500 font-medium'>
                    {cart.totalPrice.toFixed(2)}
                  </span>
                </ListGroup.Item>
                <ListGroup.Item>
                  <div className='grid'>
                    <button
                      type='button'
                      onClick={placeOrderHandler}
                      disabled={cart.cartItems.length === 0}
                      className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
                    >
                      Place Order
                    </button>
                  </div>
                  {loading && <LoadingBox></LoadingBox>}
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
