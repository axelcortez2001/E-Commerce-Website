import React from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

export default function OrderSteps(props) {
  return (
    <Row className>
  <Col className={`${props.step1 ? "active bg-blue-500 text-white" : "bg-gray-200 text-gray-800"} rounded-l-lg py-1 px-1 text-center`}>Sign In</Col>
  <Col className={`${props.step2 ? "active bg-blue-500 text-white" : "bg-gray-200 text-gray-800"} py-1 px-1 text-center`}>Customer Details</Col>
  <Col className={`${props.step3 ? "active bg-blue-500 text-white" : "bg-gray-200 text-gray-800"} rounded-r-lg py-1 px-1 text-center`}>Place Order</Col>
</Row>
  );
}
