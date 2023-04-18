import { Link, useLocation, useNavigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import { Helmet } from "react-helmet-async";
import Axios from "axios";
import { useContext, useState, useEffect } from "react";
import { Store } from "../Store";
import { toast } from "react-toastify";
import { getError } from "../utils";

export default function SignupSreen() {
  const navigate = useNavigate();
  const { search } = useLocation();
  const redirectInUrl = new URLSearchParams(search).get("redirect");
  const redirect = redirectInUrl ? redirectInUrl : "/";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [course, setCourse] = useState("");
  const [phoneNo, setPhoneNo] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPass, setConfirmPass] = useState("");

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;
  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
  };
  const isPasswordValid = (password) => {
    const passwordRegex =
      /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    return passwordRegex.test(password);
  };
  const signupHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPass) {
      toast.error("Password does not match!");
      return;
    }
    if (!isPasswordValid(password)) {
      toast.error("Password must contain symbol, number and capital letter!");
      return;
    }
    try {
      const { data } = await Axios.post("/api/users/signup", {
        name,
        email,
        address,
        course,
        phoneNo,
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
        <title>Sign Up</title>
      </Helmet>
      <h1 className='text-3xl font-bold mb-6'>Sign up</h1>
      <Form onSubmit={signupHandler}>
        <Form.Group className='mb-6' controlId='name'>
          <Form.Label className='text-lg font-bold block mb-2'>Name</Form.Label>
          <input
            id='name'
            type='text'
            onChange={(e) => setName(e.target.value)}
            required
            className='border rounded py-2 px-3 w-full'
          />
        </Form.Group>

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

        <Form.Group className='mb-6' controlId='address'>
          <Form.Label className='text-lg font-bold block mb-2'>
            Address
          </Form.Label>
          <input
            id='address'
            type='text'
            onChange={(e) => setAddress(e.target.value)}
            required
            className='border rounded py-2 px-3 w-full'
          />
        </Form.Group>

        <Form.Group className='mb-6' controlId='course'>
          <Form.Label className='text-lg font-bold block mb-2'>
            Course
          </Form.Label>
          <input
            id='course'
            type='text'
            onChange={(e) => setCourse(e.target.value)}
            required
            className='border rounded py-2 px-3 w-full'
          />
        </Form.Group>

        <Form.Group className='mb-6' controlId='phoneNo'>
          <Form.Label className='text-lg font-bold block mb-2'>
            Phone Number
          </Form.Label>
          <input
            id='phoneNo'
            type='number'
            onChange={(e) => setPhoneNo(e.target.value)}
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
            onChange={handlePasswordChange}
            required
            className='border rounded py-2 px-3 w-full'
          />
          {password && isPasswordValid(password) && (
            <span className='text-sm text-green-500'>Password Valid!</span>
          )}
          {password && !isPasswordValid(password) && (
            <span className='text-sm text-red-500'>
              Password must have at least 8 characters and contain a symbol,
              number and Capital.
            </span>
          )}
        </Form.Group>

        <Form.Group className='mb-6' controlId='comfirmPass'>
          <Form.Label className='text-lg font-bold block mb-2'>
            Confirm Password
          </Form.Label>
          <input
            id='confirmPass'
            type='password'
            onChange={(e) => setConfirmPass(e.target.value)}
            required
            className='border rounded py-2 px-3 w-full'
          />
        </Form.Group>
        <div className='mb-6'>
          <button
            type='submit'
            className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full'
          >
            Sign Up
          </button>
        </div>
        <div className='text-center'>
          <p>Already have an account? </p>
          <Link to={`/signin?redirect=${redirect}`} className='text-blue-500'>
            Sign In here!
          </Link>
        </div>
      </Form>
    </Container>
  );
}
