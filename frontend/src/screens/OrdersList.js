import React, { useContext, useEffect, useReducer } from "react";
import { useNavigate } from "react-router-dom";
import { Store } from "../Store";
import axios from "axios";
import { getError } from "../utils";
import { Helmet } from "react-helmet-async";
import LoadingBox from "../components/LoadingBox";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return {
        ...state,
        orders: action.payload,
        loading: false,
      };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export default function OrdersList() {
  const navigate = useNavigate();
  const { state } = useContext(Store);
  const { userInfo } = state;
  const [{ loading, error, orders }, dispatch] = useReducer(reducer, {
    loading: true,
    error: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await axios.get(`/api/orders`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (err) {
        dispatch({
          type: "FETCH_FAIL",
          payload: getError(err),
        });
      }
    };
    fetchData();
  }, [userInfo]);

  return (
    <div>
      <Helmet>
        <title>Orders</title>
      </Helmet>
      <h1>Orders</h1>
      {loading ? (
        <LoadingBox />
      ) : error ? (
        <div className='text-center'>{error}</div>
      ) : (
        <table className='table'>
          <thead>
            <tr>
              <th>ID</th>
              <th>USER</th>
              <th>DATE</th>
              <th>TOTAL</th>
              <th>DELIVERED</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {orders
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
              .map((order) => (
                <tr key={order._id} class='border-t-2 border-gray-200'>
                  <td class='px-4 py-2'>{order._id}</td>
                  <td class='px-4 py-2'>
                    {order.user ? order.user.name : "Deleted user"}
                  </td>
                  <td class='px-4 py-2'>{order.createdAt.substring(0, 10)}</td>
                  <td class='px-4 py-2'>{order.totalPrice}</td>
                  <td class='px-4 py-2'>
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
                      <span className='inline-block px-2 py-1 text-xs font-bold leading-none text-white bg-yellow-600 rounded'>
                        On process!
                      </span>
                    )}
                  </td>
                  <td>
                    <button
                      type='button'
                      class='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
                      onClick={() => {
                        navigate(`/order/${order._id}`);
                      }}
                    >
                      Details
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
