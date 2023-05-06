import React, { useContext, useEffect, useReducer } from "react";
import LoadingBox from "../components/LoadingBox";
import { useNavigate, useParams, Link } from "react-router-dom";
import { Store } from "../Store";
import Axios from "axios";
import { getError } from "../utils";
import { Helmet } from "react-helmet-async";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import axios from "axios";
import { toast } from "react-toastify";

function reducer(state, action) {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true, error: "" };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, order: action.payload, error: "" };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    case "DELIVER_REQUEST":
      return { ...state, loadingDeliver: true };
    case "DELIVER_SUCCESS":
      return { ...state, loadingDeliver: false, successDeliver: true };
    case "DELIVER_FAIL":
      return { ...state, loadingDeliver: false };
    case "DELIVER_RESET":
      return {
        ...state,
        loadingDeliver: false,
        successDeliver: false,
      };
    case "SET_STATUS":
      return {
        ...state,
        order: {
          ...state.order,
          status: action.payload,
        },
      };
    case "MARKED_AS_FAILED":
      return {
        ...state,
        loading: false,
        markedAsFailed: true,
      };
    default:
      return state;
  }
}

export default function OrderScreen() {
  const { state } = useContext(Store);
  const { userInfo } = state;
  const params = useParams();
  const { id: orderId } = params;
  const navigate = useNavigate();

  const [
    { loading, error, order, loadingDeliver, successDeliver, markedAsFailed },
    dispatch,
  ] = useReducer(reducer, {
    loading: true,
    order: {},
    error: "",
  });

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await Axios.get(`/api/orders/${orderId}`, {
          headers: { authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", payload: getError(err) });
      }
    };

    if (!userInfo) {
      return navigate("/login");
    }
    if (!order._id || successDeliver || (order._id && order._id !== orderId)) {
      fetchOrder();
      if (successDeliver) {
        dispatch({ type: "DELIVER_RESET" });
      }
    }
  }, [order, userInfo, orderId, navigate, successDeliver]);

  useEffect(() => {
    const checkExpiry = () => {
      const now = new Date().getTime();
      const expiry = new Date(order.expiryDate).getTime();
      if (now >= expiry) {
        processFailOrder();
        dispatch({ type: "MARKED_AS_FAILED" });
      }
    };
    const expiryInterval = setInterval(() => {
      if (markedAsFailed !== true) {
        checkExpiry();
      }
    }, 1000);
    return () => clearInterval(expiryInterval);
  }, [order, markedAsFailed]);

  async function processdeliver() {
    try {
      dispatch({ type: "DELIVER_REQUEST" });
      const { data } = await axios.put(
        `/api/orders/${order._id}/done`,
        {},
        {
          headers: { authorization: `Bearer ${userInfo.token}` },
        }
      );
      dispatch({ type: "DELIVER_SUCCESS", payload: data });
      dispatch({ type: "SET_STATUS", payload: "Delivered" });
      toast.success("Order is delivered");
    } catch (err) {
      toast.error(getError(err));
      dispatch({ type: "DELIVER_FAIL" });
    }
  }
  async function processFailOrder() {
    try {
      const { data } = await Axios.put(
        `/api/orders/${orderId}/fail`,
        {},
        {
          headers: { authorization: `Bearer ${userInfo.token}` },
        }
      );
      dispatch({ type: "FETCH_SUCCESS", payload: data });
      dispatch({ type: "SET_STATUS", payload: "Failed" });
      toast.success("Order is marked as failed");
      console.log(data);
    } catch (err) {
      toast.error(getError(err));
    }
  }

  return loading ? (
    <LoadingBox />
  ) : error ? (
    <div className='text-center'>{error}</div>
  ) : (
    <div>
      <Helmet>
        <title>Order {orderId}</title>
      </Helmet>
      <h1 className='my-3 text-center text-slate-950 text-3xl'>
        Order {orderId}
      </h1>
      <Row>
        <Col md={8}>
          <Card className='mb-3'>
            <Card.Body>
              <Card.Title>Customer Details</Card.Title>
              <Card.Text className='text-gray-600'>
                <div className='flex items-center mb-2'>
                  <strong className='mr-2'>Name:</strong>
                  <span>{order.customerDetails.fullName}</span>
                </div>
                <div className='flex items-center mb-2'>
                  <strong className='mr-2'>Phone Number:</strong>
                  <span>{order.customerDetails.phoneNo}</span>
                </div>
                <div className='flex items-center mb-2'>
                  <strong className='mr-2'>Course:</strong>
                  <span>{order.customerDetails.course}</span>
                </div>
                <div className='flex items-center mb-2'>
                  <strong className='mr-2'>Address:</strong>
                  <span>{order.customerDetails.address}</span>
                </div>
                <div className='flex items-center mb-2'>
                  <strong className='mr-2'>Expiry Date:</strong>
                  <span>
                    {new Date(order.expiryDate).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
              </Card.Text>
              {order.isDelivered ? (
                <span className='inline-block px-2 py-1 text-xs font-bold leading-none text-white bg-green-600 rounded'>
                  Received at {order.deliveredAt}
                </span>
              ) : order.isFailed ? (
                <span className='inline-block px-2 py-1 text-xs font-bold leading-none text-white bg-red-600 rounded'>
                  Failed
                </span>
              ) : order.expiryDate >= Date.now ? (
                <span className='inline-block px-2 py-1 text-xs font-bold leading-none text-white bg-red-600 rounded'>
                  Expired
                </span>
              ) : (
                <span className='inline-block px-2 py-1 text-xs font-bold leading-none text-white bg-red-600 rounded'>
                  On process!
                </span>
              )}
            </Card.Body>
          </Card>
          <Card className='mb-3'>
            <Card.Body>
              <Card.Title className='text-2xl font-bold mb-4'>
                Product Details
              </Card.Title>
              <ListGroup className='bg-white shadow overflow-hidden rounded-md'>
                {order.orderItems.map((item) => (
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
                        <Link to={`/product/${item.slug}`}>
                          <h1 className='text-lg font-semibold'>{item.name}</h1>
                        </Link>
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
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className='border border-gray-200 rounded-lg shadow-md'>
            <Card.Body>
              <Card.Title className='text-xl font-bold mb-4'>
                Order Summary
              </Card.Title>
              <ListGroup>
                <ListGroup.Item className='flex justify-between items-center'>
                  <span>Order Total</span>
                  <span className='text-green-500 font-medium'>
                    {order.totalPrice.toFixed(2)}
                  </span>
                </ListGroup.Item>
                {userInfo.isAdmin && !order.isDelivered && !order.isFailed && (
                  <ListGroup.Item className='flex items-center justify-center'>
                    {loadingDeliver && <LoadingBox />}
                    <button
                      type='button'
                      onClick={processdeliver}
                      className='bg-green-500 hover:bg-green-600 w-full text-white font-semibold px-4 py-2 rounded-lg transition duration-300'
                    >
                      Mark Done
                    </button>
                  </ListGroup.Item>
                )}
                {userInfo.isAdmin && !order.isFailed && !order.isDelivered && (
                  <ListGroup.Item className='flex items-center justify-center'>
                    {loadingDeliver && <LoadingBox />}
                    <button
                      type='button'
                      onClick={processFailOrder}
                      className='bg-red-500 hover:bg-red-600 w-full text-white font-semibold px-4 py-2 rounded-lg transition duration-300'
                    >
                      Mark as Failed
                    </button>
                  </ListGroup.Item>
                )}
                {order.isFailed && (
                  <ListGroup.Item>
                    Order has been marked as failed.
                  </ListGroup.Item>
                )}
                <ListGroup.Item>
                  <div className='grid'></div>
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
