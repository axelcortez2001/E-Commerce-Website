import React, { useContext, useEffect, useReducer, useState } from "react";
import { Store } from "../Store";
import { useNavigate, useParams } from "react-router-dom";
import { getError } from "../utils";
import axios from "axios";
import { toast } from "react-toastify";
import { Helmet } from "react-helmet-async";
import LoadingBox from "../components/LoadingBox";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: false };
    case "FETCH_SUCCESS":
      return { ...state, loading: false };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    case "UPDATE_REQUEST":
      return { ...state, loadingUpdate: true };
    case "UPDATE_SUCCESS":
      return { ...state, loadingUpdate: false };
    case "UPDATE_FAIL":
      return { ...state, loadingUpdate: false };
    default:
      return state;
  }
};

export default function UserEdit() {
  const [{ loading, error, loadingUpdate }, dispatch] = useReducer(reducer, {
    loading: true,
    error: "",
  });
  const { state } = useContext(Store);
  const { userInfo } = state;
  const params = useParams();
  const { id: userId } = params;
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [course, setCourse] = useState("");
  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await axios.get(`/api/users/${userId}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        setName(data.name);
        setEmail(data.email);
        setAddress(data.address);
        setCourse(data.course);
      } catch (err) {
        dispatch({
          type: "FETCH_FAIL",
          payload: getError(err),
        });
      }
    };
    fetchData();
  }, [userId, userInfo]);
  const edituser = async (e) => {
    e.preventDefault();
    try {
      dispatch({ type: "UPDATE_REQUEST" });
      await axios.put(
        `/api/users/${userId}`,
        { _id: userId, name, email, address, course },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
      dispatch({
        type: "UPDATE_SUCCESS",
      });
      toast.success("User updated successfully");
      navigate("/admin/users");
    } catch (error) {
      toast.error(getError(error));
      dispatch({ type: "UPDATE_FAIL" });
    }
  };
  return (
    <Container className='max-w-sm mx-auto mt-8 p-8 bg-white rounded-lg shadow-md'>
      <Helmet>
        <title>Edit user {userId}</title>
      </Helmet>
      <h1 className='text-2xl font-bold mb-4'>Edit User {name}</h1>
      {loading ? (
        <LoadingBox />
      ) : error ? (
        <div className='text-center mt-8'>{error}</div>
      ) : (
        <Form onSubmit={edituser} className='space-y-4'>
          <Form.Group controlId='name'>
            <Form.Label className='block font-semibold'>Name</Form.Label>
            <Form.Control
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className='w-full'
            />
          </Form.Group>
          <Form.Group controlId='email'>
            <Form.Label className='block font-semibold'>Email</Form.Label>
            <Form.Control
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className='w-full'
            />
          </Form.Group>
          <Form.Group controlId='address'>
            <Form.Label className='block font-semibold'>Address</Form.Label>
            <Form.Control
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
              className='w-full'
            />
          </Form.Group>
          <Form.Group controlId='course'>
            <Form.Label className='block font-semibold'>Course</Form.Label>
            <Form.Control
              value={course}
              onChange={(e) => setCourse(e.target.value)}
              required
              className='w-full'
            />
          </Form.Group>
          <div className='flex items-center space-x-4'>
            <button
              disabled={loadingUpdate}
              type='submit'
              className='px-4 py-2 bg-blue-500 text-white rounded-md font-semibold focus:outline-none'
            >
              Update
            </button>
            {loadingUpdate && <LoadingBox />}
          </div>
        </Form>
      )}
    </Container>
  );
}
