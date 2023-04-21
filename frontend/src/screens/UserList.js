import React, { useContext, useEffect, useReducer } from "react";
import { Store } from "../Store";
import axios from "axios";
import { getError } from "../utils";
import { Helmet } from "react-helmet-async";
import LoadingBox from "../components/LoadingBox";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return {
        ...state,
        users: action.payload,
        loading: false,
      };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    case "DELETE_REQUEST":
      return { ...state, loadingDelete: true, successDelete: false };
    case "DELETE_SUCCESS":
      return {
        ...state,
        loadingDelete: false,
        successDelete: true,
      };
    case "DELETE_FAIL":
      return { ...state, loadingDelete: false };
    case "DELETE_RESET":
      return { ...state, loadingDelete: false, successDelete: false };
    default:
      return state;
  }
};

export default function UserList() {
  const [{ loading, error, users, loadingDelete, successDelete }, dispatch] =
    useReducer(reducer, {
      loading: true,
      error: "",
    });

  const { state } = useContext(Store);
  const { userInfo } = state;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await axios.get(`/api/users`, {
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

    if (successDelete) {
      dispatch({ type: "DELETE_RESET" });
    } else {
      fetchData();
    }
  }, [userInfo, successDelete]);

  const deleteuser = async (user) => {
    if (window.confirm("Are you sure to delete the user?")) {
      try {
        dispatch({ type: "DELETE_REQUEST" });
        await axios.delete(`/api/users/${user._id}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        toast.success("user deleted successfully");
        dispatch({ type: "DELETE_SUCCESS" });
      } catch (error) {
        toast.error(getError(error));
        dispatch({
          type: "DELETE_FAIL",
        });
      }
    }
  };
  return (
    <div class='w-full'>
      <Helmet>
        <title>Users</title>
      </Helmet>
      <h1 class='text-center text-4xl font-bold mt-8'>Users</h1>
      {loadingDelete && <LoadingBox />}
      {loading ? (
        <LoadingBox />
      ) : error ? (
        <div class='text-center mt-8'>{error}</div>
      ) : (
        <table class='w-full mt-8'>
          <thead>
            <tr class='bg-gray-200'>
              <th class='py-4 px-6 text-left'>ID</th>
              <th class='py-4 px-6 text-left'>NAME</th>
              <th class='py-4 px-6 text-left'>EMAIL</th>
              <th class='py-4 px-6 text-left'>ADDRESS</th>
              <th class='py-4 px-6 text-left'>COURSE</th>
              <th class='py-4 px-6 text-left'>PHONE</th>
              <th class='py-4 px-6 text-left'>ADMIN</th>
              <th class='py-4 px-6 text-left'>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} class='border-b border-gray-200'>
                <td class='py-4 px-6'>{user._id}</td>
                <td class='py-4 px-6'>{user.name}</td>
                <td class='py-4 px-6'>{user.email}</td>
                <td class='py-4 px-6'>{user.address}</td>
                <td class='py-4 px-6'>{user.course}</td>
                <td class='py-4 px-6'>{user.phoneNo}</td>
                <td class='py-4 px-6'> {user.isAdmin ? "Yes" : "No"}</td>
                <td class='px-4 py-6 flex justify-center'>
                  <button
                    class='text-blue-500 hover:text-blue-700 mr-2'
                    type='button'
                    onClick={() => navigate(`/admin/user/${user._id}`)}
                  >
                    Edit
                  </button>
                  <button
                    class='text-red-500 hover:text-red-700'
                    type='button'
                    onClick={() => deleteuser(user)}
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
  );
}
