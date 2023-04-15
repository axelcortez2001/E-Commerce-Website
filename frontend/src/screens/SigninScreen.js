import { Link, useLocation, useNavigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import { Helmet } from "react-helmet-async";
import Axios from "axios";
import { useContext, useState, useEffect } from "react";
import { Store } from "../Store";
import { toast } from "react-toastify";
import { getError } from '../utils';

export default function SigninSreen() {
  const navigate = useNavigate();
  const { search } = useLocation();
  const redirectInUrl = new URLSearchParams(search).get("redirect");
  const redirect = redirectInUrl ? redirectInUrl : "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;
  const signinHandler = async (e) => {
    e.preventDefault();
    try {
      const { data } = await Axios.post("/api/users/signin", {
        email,
        password,
      });
      ctxDispatch({ type: "USER_SIGNIN", payload: data });
      localStorage.setItem("userInfo", JSON.stringify(data));
      navigate(redirect || "/");
    } catch (err) {
      toast.error(getError(err));
    }
  };
  //it will redirect to homepage once user force or type signin in the url
  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  return (
    <Container className='mx-auto max-w-md bg-gray-100 rounded-lg shadow-lg py-6 px-8'>
      <Helmet>
        <title>Sign In</title>
      </Helmet>
      <h1 className='text-3xl font-bold mb-6'>Sign In</h1>
      <Form onSubmit={signinHandler}>
        <Form.Group className='mb-6' controlId='email'>
          <Form.Label className='text-lg font-bold block mb-2'>
            Email
          </Form.Label>
          <input
            id='email'
            type='email'
            onChange={(e) => setEmail(e.target.value)}
            required
            className='border rounded py-2 px-3 w-full'
          />
        </Form.Group>
        <Form.Group className='mb-6' controlId='password'>
          <Form.Label className='text-lg font-bold block mb-2'>
            Password
          </Form.Label>
          <input
            id='password'
            type='password'
            onChange={(e) => setPassword(e.target.value)}
            required
            className='border rounded py-2 px-3 w-full'
          />
        </Form.Group>
        <div className='mb-6'>
          <button
            type='submit'
            className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full'
          >
            Sign In
          </button>
        </div>
        <div className='text-center'>
          <p>New Customer? </p>
          <Link to={`/signup?redirect=${redirect}`} className='text-blue-500'>
            Sign up here!
          </Link>
        </div>
      </Form>
    </Container>
  );
}
