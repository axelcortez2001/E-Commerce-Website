import Rating from "./Rating";
import { Link } from "react-router-dom";
import axios from "axios";
import { useContext } from "react";
import { Store } from "../Store";

function Product(props) {
  const { product } = props;
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    cart: { cartItems },
  } = state;

  const addCart = async (item) => {
    const existItem = cartItems.find((x) => x._id === product._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`/api/products/${item._id}`);
    if (quantity > 10) {
      window.alert("You can only add up to 10 items in your cart.");
      return;
    }
    if (data.countInStock < quantity) {
      window.alert("Sorry. Product is out of stock");
      return;
    }
    ctxDispatch({
      type: "CART_ADD_ITEM",
      payload: { ...item, quantity },
    });
  };
  return (
    <div class='bg-white shadow-md rounded-md overflow-hidden'>
      <Link to={`/product/${product.slug}`}>
        <img
          class='object-cover h-48 w-full'
          src={product.image}
          alt={product.name}
        />
      </Link>
      <div class='p-4'>
        <Link to={`/product/${product.slug}`}>
          <h2 class='text-lg font-medium text-gray-800 hover:text-gray-900'>
            {product.name}
          </h2>
        </Link>
        <Rating rating={product.rating} numReview={product.numReview} />
        <p className='text-gray-600'>Price: {product.price}</p>
        <p className='text-gray-600'>Stock: {product.countInStock}</p>
        {product.countInStock === 0 ? (
          <p className='bg-red-500 text-white font-bold text-center py-1 px-2 mt-4 rounded-full'>
            {" "}
            Out of Stock
          </p>
        ) : (
          <button
            onClick={() => addCart(product)}
            className='inline-block px-2 py-1 mt-4 font-semibold text-white bg-gray-800 rounded-full hover:bg-gray-900 focus:bg-gray-900'
          >
            Add to cart
          </button>
        )}
      </div>
    </div>
  );
}
export default Product;
