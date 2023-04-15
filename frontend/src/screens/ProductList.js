import React, { useContext, useEffect, useReducer } from "react";
import { Store } from "../Store";
import axios from "axios";
import LoadingBox from "../components/LoadingBox";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { toast } from "react-toastify";
import { getError } from "../utils";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return {
        ...state,
        products: action.payload.products,
        page: action.payload,
        pages: action.payload,
        loading: false,
      };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    case "CREATE_REQUEST":
      return { ...state, loadingCreate: true };
    case "CREATE_SUCCESS":
      return {
        ...state,
        loadingCreate: false,
      };
    case "CREATE_FAIL":
      return { ...state, loadingCreate: false };
    default:
      return state;
  }
};

export default function ProductList() {
  const [{ loading, error, products, pages, loadingCreate }, dispatch] =
    useReducer(reducer, {
      loading: true,
      error: "",
    });

  const { search } = useLocation();
  const navigate = useNavigate();
  const sp = new URLSearchParams(search);
  const page = sp.get("page") || 1;
  const { state } = useContext(Store);
  const { userInfo } = state;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(`/api/products/admin?page=${page} `, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (err) {}
    };
    fetchData();
  }, [page, userInfo]);

  const addProd = async () => {
    if (window.confirm("Are you sure to create?")) {
      try {
        dispatch({ type: "CREATE_SUCCESS" });
        const { data } = await axios.post(
          "/api/products",
          {},
          {
            headers: { Authorization: `Bearer ${userInfo.token}` },
          }
        );
        toast.success("product created successfully");
        dispatch({ type: "CREATE_SUCCESS" });
        navigate(`/admin/products/${data.product._id}`);
      } catch (err) {
        toast.error(getError(err));
        dispatch({
          type: "CREATE_FAIL",
        });
      }
    }
  };
  return (
    <div class='mx-auto'>
      <div class='flex justify-between items-center mb-8'>
        <h1 class='text-3xl font-bold'>Products</h1>

        <button
          onClick={addProd}
          class='bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded'
        >
          Add Product
        </button>
      </div>
      <div class='overflow-x-auto'>
        {loading ? (
          <LoadingBox />
        ) : error ? (
          <div className='text-center'>{error}</div>
        ) : (
          <table class='w-full table-fixed'>
            <thead class='bg-gray-200'>
              <tr class='text-left'>
                <th class='w-2/6 px-4 py-2'>ID</th>
                <th class='w-2/6 px-4 py-2'>NAME</th>
                <th class='w-1/6 px-4 py-2'>PRICE</th>
                <th class='w-1/6 px-4 py-2'>QUANTITY</th>
                <th class='w-1/6 px-4 py-2'>BRAND</th>
                <th class='w-1/6 px-4 py-2'>CATEGORY</th>
                <th class='w-1/6 px-4 py-2'>ACTIONS</th>
              </tr>
            </thead>
            <tbody class='bg-white'>
              {products.map((product) => (
                <tr key={product._id} class='border-b border-gray-300'>
                  <td class='px-4 py-2'>{product._id}</td>
                  <td class='px-4 py-2'>{product.name}</td>
                  <td class='px-4 py-2'>{product.price}</td>
                  <td class='px-4 py-2'>{product.countInStock}</td>
                  <td class='px-4 py-2'>{product.brand}</td>
                  <td class='px-4 py-2'>{product.category}</td>
                  <button
                    type='button'
                    onClick={() => navigate(`/admin/products/${product._id}`)}
                  >
                    Edit
                  </button>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      {pages > 1 && (
        <div class='flex justify-center mt-8'>
          {[...Array(pages).keys()].map((x) => (
            <Link
              class={`bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-2 rounded-lg mx-2 ${
                x + 1 === Number(page) ? "bg-gray-600 text-white font-bold" : ""
              }`}
              key={x + 1}
              to={`/admin/products?page=${x + 1}`}
            >
              {x + 1}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
