import React, { useContext, useEffect, useReducer } from "react";
import { Helmet } from "react-helmet-async";
import LoadingBox from "../components/LoadingBox";
import { Store } from "../Store";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { getError } from "../utils";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, orders: action.payload, loading: false };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export default function OrderHistoryScreen() {
  const { state } = useContext(Store);
  const { userInfo } = state;
  const navigate = useNavigate();

  const [{ loading, error, orders }, dispatch] = useReducer(reducer, {
    loading: true,
    error: "",
  });
  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: "FETCH_REQUEST" });
      try {
        const { data } = await axios.get(
          `/api/orders/mine`,

          { headers: { Authorization: `Bearer ${userInfo.token}` } }
        );
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (error) {
        dispatch({
          type: "FETCH_FAIL",
          payload: getError(error),
        });
      }
    };
    fetchData();
  }, [userInfo]);
  return (
    <div class='bg-gray-100 py-6'>
      <div class='container mx-auto'>
        <Helmet>
          <title>Order History</title>
        </Helmet>
        <h1 class='text-3xl font-bold mb-6'>Order History</h1>
        {loading ? (
          <LoadingBox />
        ) : error ? (
          <div class='text-center'>{error}</div>
        ) : (
          <div class='overflow-x-auto'>
            <table class='table-auto w-full'>
              <thead>
                <tr class='text-left'>
                  <th class='px-4 py-2'>ID</th>
                  <th class='px-4 py-2'>DATE</th>
                  <th class='px-4 py-2'>TOTAL</th>
                  <th class='px-4 py-2'>PROGRESS</th>
                  <th class='px-4 py-2'>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {orders
                  .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                  .map((order) => (
                    <tr key={order._id} class='border-t-2 border-gray-200'>
                      <td class='px-4 py-2'>{order._id}</td>
                      <td class='px-4 py-2'>
                        {order.createdAt.substring(0, 10)}
                      </td>
                      <td class='px-4 py-2'>{order.totalPrice.toFixed(2)}</td>
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
                      <td class='px-4 py-2'>
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
          </div>
        )}
      </div>
    </div>
  );
}
