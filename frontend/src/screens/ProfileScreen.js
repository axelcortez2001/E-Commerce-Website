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
  const [confirmPass, setConfirmPass] = useState("");

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
  };
  const isPasswordValid = (password) => {
    const passwordRegex =
      /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    return passwordRegex.test(password);
  };

  const [{ loadingUpdate }, dispatch] = useReducer(reducer, {
    loadingUpdate: false,
  });

  const updateUser = async (e) => {
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
      const { data } = await axios.put(
        `api/users/userprofile/${userInfo._id}`,
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
        <title>User Profile</title>
      </Helmet>
      <h1 className='text-3xl font-bold mb-6'>User Profile</h1>
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
            Update
          </button>
        </div>
      </Form>
    </Container>
  );
}
