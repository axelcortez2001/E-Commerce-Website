import React, { useContext, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Store } from "../Store";
import { useNavigate } from "react-router-dom";
import OrderSteps from "../components/OrderSteps";

export default function CustomerDetails() {
  const navigate = useNavigate();
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    userInfo,
    cart: { customerDetails },
  } = state;
  const [fullName, setFullName] = useState(customerDetails.fullName || "");
  const [phoneNo, setPhoneNo] = useState(customerDetails.phoneNo || "");
  const [course, setCourse] = useState(customerDetails.course || "");
  const [address, setAddress] = useState(customerDetails.address || "");

  useEffect(() => {
    if (!userInfo) {
      navigate("/signin?redirect=/confirm");
    }
  }, [userInfo, navigate]);

  const confirmOrder = (e) => {
    e.preventDefault();
    ctxDispatch({
      type: "SAVE_CUSTOMER_DETAILS",
      payload: {
        fullName,
        phoneNo,
        course,
        address,
      },
    });
    localStorage.setItem(
      "customerDetails",
      JSON.stringify({
        fullName,
        phoneNo,
        course,
        address,
      })
    );
    navigate("/placeorder");
  };
  return (
    <div class='bg-gray-100 py-8'>
      <Helmet>
        <title>CustomerDetails</title>
      </Helmet>
      <OrderSteps step1 step2></OrderSteps>
      <div class='container mx-auto px-4 mt-2'>
        <div class='max-w-xl mx-auto bg-white rounded-lg shadow-lg'>
          <div class='py-6 px-8 border-b border-gray-200'>
            <h1 class='text-2xl font-bold text-gray-800'>Customer Details</h1>
          </div>
          <form class='py-6 px-8' onSubmit={confirmOrder}>
            <div class='mb-4'>
              <label class='block text-gray-700 font-bold mb-2' for='fullName'>
                Full Name
              </label>
              <input
                class='appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                id='fullName'
                type='text'
                placeholder='Enter your full name'
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>
            <div class='mb-4'>
              <label class='block text-gray-700 font-bold mb-2' for='phoneNo'>
                Phone Number
              </label>
              <input
                class='appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                id='phoneNo'
                type='text'
                placeholder='Enter your phone number'
                value={phoneNo}
                onChange={(e) => setPhoneNo(e.target.value)}
                required
              />
            </div>
            <div class='mb-4'>
              <label class='block text-gray-700 font-bold mb-2' for='course'>
                Course
              </label>
              <input
                class='appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                id='course'
                type='text'
                placeholder='Enter your course'
                value={course}
                onChange={(e) => setCourse(e.target.value)}
                required
              />
            </div>
            <div class='mb-4'>
              <label class='block text-gray-700 font-bold mb-2' for='address'>
                Address
              </label>
              <input
                class='appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                id='address'
                type='text'
                placeholder='Enter your address'
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
            </div>
            <div class='py-4 px-8 text-center'>
              <p class='text-gray-700'>
                For safety and security, we only allow pickup from the
                Bookstore.
              </p>
              <p class='text-gray-700 mt-2'>
                Thank you for your understanding and we look forward to serving
                you soon.
              </p>
              <p class='text-red-500 mt-2'>
                Note: Order will expire after 2 days and will be mark as failed
                if not claimed!
              </p>
            </div>
            <button
              type='submit'
              class='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full'
            >
              Confirm
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
