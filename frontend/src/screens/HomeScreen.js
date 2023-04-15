import { useEffect, useReducer } from "react";
import axios from "axios";
import Product from "../components/Product";
import { Helmet } from "react-helmet-async";
import LoadingBox from "../components/LoadingBox";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, products: action.payload, loading: false };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

function HomeScreen() {
  const [{ loading, error, products }, dispatch] = useReducer(reducer, {
    products: [],
    loading: true,
    error: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: "FETCH_REQUEST" });
      try {
        const result = await axios.get("/api/products");
        dispatch({ type: "FETCH_SUCCESS", payload: result.data });
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", payload: err.message });
      }
    };
    fetchData();
  }, []);

  return (
    <div className='bg-gray-100 p-6'>
      <Helmet>
        <title>Marian Shop</title>
      </Helmet>
      <h1 className='text-2xl font-bold mb-4'>Featured Products</h1>
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
        {loading ? (
          <LoadingBox />
        ) : error ? (
          <div className='text-center'>{error}</div>
        ) : (
          products.map((product) => (
            <div key={product.slug}>
              <Product product={product} />
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default HomeScreen;
