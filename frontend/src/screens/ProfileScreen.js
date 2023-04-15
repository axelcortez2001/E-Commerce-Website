import { Helmet } from "react-helmet-async";
import { Store } from "../Store";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import axios from "axios";
import { useContext, useState, useReducer } from "react";
import { toast } from "react-toastify";
import { getError } from "../utils";

const reducer = (state, action) => {
  switch (action.type) {
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

export default function ProfileScreen() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;
  const [name, setName] = useState(userInfo.name);
  const [email, setEmail] = useState(userInfo.email);
  const [address, setAddress] = useState(userInfo.address);
  const [course, setCourse] = useState(userInfo.course);
  const [phoneNo, setPhoneNo] = useState(userInfo.email);
  const [password, setPassword] = useState(userInfo.password);

  const [{ loadingUpdate }, dispatch] = useReducer(reducer, {
    loadingUpdate: false,
  });

  const updateUser = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.put(
        "api/users/userprofile",
        {
          name,
          email,
          address,
          course,
          phoneNo,
          password,
        },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
      dispatch({
        type: "UPDATE_SUCCESS",
      });
      ctxDispatch({ type: "USER_SIGNIN", payload: data });
      localStorage.setItem("userInfo", JSON.stringify(data));
      toast.success("User Updated Successfully!");
    } catch (err) {
      dispatch({
        type: "FETCH_FAIL",
      });
      toast.error(getError(err));
    }
  };
  return (
    <Container className='mx-auto max-w-md bg-gray-100 rounded-lg shadow-lg py-6 px-8'>
      <Helmet>
        <title>Sign Up</title>
      </Helmet>
      <h1 className='text-3xl font-bold mb-6'>Sign up</h1>
      <Form onSubmit={updateUser}>
        <Form.Group className='mb-6' controlId='name'>
          <Form.Label className='text-lg font-bold block mb-2'>Name</Form.Label>
          <input
            id='name'
            value={name}
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
            value={email}
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
            value={address}
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
            value={course}
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
            value={phoneNo}
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
            value={password}
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
            Update
          </button>
        </div>
      </Form>
    </Container>
  );
}
