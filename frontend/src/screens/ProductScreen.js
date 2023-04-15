import axios from "axios";
import React, { useEffect, useReducer, useContext } from "react";
import Card from "react-bootstrap/Card";
import Rating from "../components/Rating";
import { useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Store } from "../Store";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, product: action.payload, loading: false };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

function ProductScreen() {
  const navigate = useNavigate();
  const params = useParams();
  const { slug } = params;

  const [{ loading, error, product }, dispatch] = useReducer(reducer, {
    product: [],
    loading: true,
    error: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: "FETCH_REQUEST" });
      try {
        const result = await axios.get(`/api/products/slug/${slug}`);
        dispatch({ type: "FETCH_SUCCESS", payload: result.data });
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", payload: err.message });
      }
    };
    fetchData();
  }, [slug]);

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart } = state;
  const addtocart = async () => {
    const existItem = cart.cartItems.find((x) => x._id === product._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`/api/products/${product._id}`);
    if (data.countInStock < quantity) {
      window.alert("Sorry. Product is out of stock");
      return;
    }
    ctxDispatch({
      type: "CART_ADD_ITEM",
      payload: { ...product, quantity },
    });
    navigate("/cart");
  };

  return loading ? (
    <div className='text-center'>Loading...</div>
  ) : error ? (
    <div className='text-center'>{error}</div>
  ) : (
    <div>
      <div className='flex flex-wrap justify-between items-start'>
        <div className='w-full md:w-1/2 mb-4 md:mb-0'>
          <img
            className='w-full rounded-lg'
            src={product.image}
            alt={product.name}
          ></img>
        </div>
        <div className='w-full md:w-1/2 md:pl-6'>
          <div>
            <Helmet>
              <title>{product.name}</title>
            </Helmet>
          </div>
          <div className='mb-2'>
            <Rating rating={product.rating} numReview={product.numReview} />
          </div>
          <div className='mb-2'>Price: {product.price}</div>
          <div className='mb-2'>
            Description:
            <p>{product.description}</p>
          </div>
          <div className='mt-4'>
            <Card>
              <Card.Body>
                <div className='mb-4'>
                  <div className='mb-1 font-semibold'>Price:</div>
                  <div>{product.price}</div>
                </div>
                <div className='mb-4'>
                  <div className='mb-1 font-semibold'>Status:</div>
                  <div>
                    {product.countInStock > 0 ? (
                      <span className='inline-block px-2 py-1 text-xs font-bold leading-none text-white bg-green-600 rounded'>
                        In Stock
                      </span>
                    ) : (
                      <span className='inline-block px-2 py-1 text-xs font-bold leading-none text-white bg-red-600 rounded'>
                        Out of Stock
                      </span>
                    )}
                  </div>
                </div>
                {product.countInStock > 0 && (
                  <div>
                    <button
                      onClick={addtocart}
                      className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700'
                    >
                      Add to Cart
                    </button>
                  </div>
                )}
              </Card.Body>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductScreen;
