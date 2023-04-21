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
    case "DELETE_REQUEST":
      return { ...state, loadingDelete: true, successDelete: false };
    case "DELETE_SUCCESS":
      return {
        ...state,
        loadingDelete: false,
        successDelete: true,
      };
    case "DELETE_FAIL":
      return { ...state, loadingDelete: false, successDelete: false };

    case "DELETE_RESET":
      return { ...state, loadingDelete: false, successDelete: false };
    default:
      return state;
  }
};

export default function ProductList() {
  const [
    {
      loading,
      error,
      products,
      pages,
      loadingCreate,
      loadingDelete,
      successDelete,
    },
    dispatch,
  ] = useReducer(reducer, {
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
    if (successDelete) {
      dispatch({ type: "DELETE_RESET" });
    } else {
      fetchData();
    }
  }, [page, userInfo, successDelete]);

  const addProd = async () => {
    if (window.confirm("This will create a new product for edit!")) {
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
  const deleteProd = async (product) => {
    if (window.confirm("Product will be deleted?")) {
      try {
        await axios.delete(`/api/products/${product._id}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        toast.success("product deleted successfully");
        dispatch({ type: "DELETE_SUCCESS" });
      } catch (err) {
        toast.error(getError(err));
        dispatch({
          type: "DELETE_FAIL",
        });
      }
    }
  };
  return (
    <div class='mx-auto'>
      <div class='flex flex-col sm:flex-row justify-between items-center mb-8'>
        <h1 class='text-3xl font-bold mb-4 sm:mb-0'>Products</h1>

        <button
          onClick={addProd}
          class='bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded'
        >
          Add Product
        </button>
      </div>
      <div class='overflow-x-auto'>
        {loadingDelete && loadingCreate && <LoadingBox></LoadingBox>}
        {loading ? (
          <LoadingBox />
        ) : error ? (
          <div className='text-center'>{error}</div>
        ) : (
          <table class='w-full table-fixed text-sm sm:text-base'>
            <thead class='bg-gray-200'>
              <tr class='text-left'>
                <th class='w-2/6 px-2 py-2'>ID</th>
                <th class='w-2/6 px-2 py-2'>NAME</th>
                <th class='w-1/6 px-2 py-2'>PRICE</th>
                <th class='w-1/6 px-2 py-2'>QUANTITY</th>
                <th class='w-1/6 px-2 py-2'>BRAND</th>
                <th class='w-1/6 px-2 py-2'>CATEGORY</th>
                <th class='w-1/6 px-2 py-2'>ACTIONS</th>
              </tr>
            </thead>
            <tbody class='bg-white divide-y divide-gray-200'>
              {products.map((product) => (
                <tr key={product._id} class='border-b border-gray-300'>
                  <td class='px-2 py-2'>{product._id}</td>
                  <td class='px-2 py-2'>{product.name}</td>
                  <td class='px-2 py-2'>{product.price}</td>
                  <td class='px-2 py-2'>{product.countInStock}</td>
                  <td class='px-2 py-2'>{product.brand}</td>
                  <td class='px-2 py-2'>{product.category}</td>
                  <td class='px-2 py-2 flex justify-center'>
                    <button
                      class='text-blue-500 hover:text-blue-700 mr-2'
                      type='button'
                      onClick={() => navigate(`/admin/products/${product._id}`)}
                    >
                      Edit
                    </button>
                    <button
                      class='text-red-500 hover:text-red-700'
                      type='button'
                      onClick={() => deleteProd(product)}
                    >
                      Delete
                    </button>
                  </td>
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
