import axios from "axios";
import React, {
  useEffect,
  useReducer,
  useContext,
  useRef,
  useState,
} from "react";
import Card from "react-bootstrap/Card";
import Rating from "../components/Rating";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Store } from "../Store";
import { toast } from "react-toastify";
import { getError } from "../utils";
import { Button, FloatingLabel, Form, ListGroup } from "react-bootstrap";
import LoadingBox from "../components/LoadingBox";

const reducer = (state, action) => {
  switch (action.type) {
    case "REFRESH_PRODUCT":
      return { ...state, product: action.payload };
    case "CREATE_REQUEST":
      return { ...state, loadingCreateReview: true };
    case "CREATE_SUCCESS":
      return { ...state, loadingCreateReview: false };
    case "CREATE_FAIL":
      return { ...state, loadingCreateReview: false };
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
  let reviewprod = useRef();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const navigate = useNavigate();
  const params = useParams();
  const { slug } = params;

  const [{ loading, error, product, loadingCreateReview }, dispatch] =
    useReducer(reducer, {
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
  const { cart, userInfo } = state;
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

  const submitrating = async (e) => {
    e.preventDefault();
    if (!comment || !rating) {
      toast.error("Please rate and comment first");
      return;
    }
    try {
      const { data } = await axios.post(
        `/api/products/${product._id}/reviews`,
        { rating, comment, name: userInfo.name },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );

      dispatch({
        type: "CREATE_SUCCESS",
      });
      toast.success("Review submitted successfully");
      product.reviews.unshift(data.review);
      product.numReview = data.numReview;
      product.rating = data.rating;
      dispatch({ type: "REFRESH_PRODUCT", payload: product });
      window.scrollTo({
        behavior: "smooth",
        top: reviewprod.current.offsetTop,
      });
    } catch (error) {
      toast.error(getError(error));
      dispatch({ type: "CREATE_FAIL" });
    }
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
        <div className='my-3 w-full'>
          <h2 ref={reviewprod} className='text-xl font-bold mb-3'>
            Reviews
          </h2>
          <div className='mb-3'>
            {product.reviews.length === 0 && (
              <div className='text-center'>There is no Review!</div>
            )}
          </div>
          <ListGroup>
            {product.reviews.map((review) => (
              <ListGroup.Item
                key={review._id}
                className='flex flex-col space-y-2'
              >
                <strong className='text-lg font-semibold'>{review.name}</strong>
                <Rating
                  rating={review.rating}
                  caption=' '
                  className='text-sm'
                ></Rating>
                <p className='text-sm'>{review.createdAt.substring(0, 10)}</p>
                <p className='text-sm'>{review.comment}</p>
              </ListGroup.Item>
            ))}
          </ListGroup>
          <div className='my-3'>
            {userInfo ? (
              <form onSubmit={submitrating} className='space-y-3'>
                <h2 className='text-xl font-bold'>Write a customer Review</h2>
                <Form.Group className='mb-3' controlId='rating'>
                  <Form.Label className='text-sm font-semibold'>
                    Rating
                  </Form.Label>
                  <Form.Select
                    aria-label='Rating'
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                    className='text-sm'
                  >
                    <option value=''>Select...</option>
                    <option value='1'>1- Poor</option>
                    <option value='2'>2- Fair</option>
                    <option value='3'>3- Good</option>
                    <option value='4'>4- Very good</option>
                    <option value='5'>5- Excellent</option>
                  </Form.Select>
                </Form.Group>
                <FloatingLabel
                  controlId='floatingTextarea'
                  label='Comments'
                  className='mb-3'
                >
                  <Form.Control
                    as='textarea'
                    placeholder='Leave a comment here'
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className='text-sm'
                  />
                </FloatingLabel>
                <div className='flex space-x-2'>
                  <Button
                    disabled={loadingCreateReview}
                    type='submit'
                    className='bg-blue-500 text-white font-semibold px-4 py-2 rounded-md'
                  >
                    Submit
                  </Button>
                  {loadingCreateReview && <LoadingBox />}
                </div>
              </form>
            ) : (
              <div className='text-center'>
                Please{" "}
                <Link
                  to={`/signin?redirect=/product/${product.slug}`}
                  className='text-blue-500 font-semibold'
                >
                  Sign In
                </Link>{" "}
                to write a review
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductScreen;
