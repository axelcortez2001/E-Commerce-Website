//sample data
import bcrypt from "bcryptjs";
const data = {
  users: [
    {
      name: "Axel",
      email: "marshop@gmail.com",
      password: bcrypt.hashSync("qwerty12345"),
      isAdmin: true,
    },
    {
      name: "allen",
      email: "allen@gmail.com",
      password: bcrypt.hashSync("12345"),
      isAdmin: false,
    },
  ],
  products: [
    {
      name: "Nike Shoes",
      slug: "nike-slim-shoe",
      category: "Shoe",
      image: "/images/p1.jpg",
      price: 500,
      countInStock: 0,
      brand: "Nike",
      rating: 1.5,
      numReview: 10,
      description: "high quality shoe",
    },
    {
      name: "Adidas shoe",
      slug: "adidas-slim-shoe",
      category: "Shoe",
      image: "/images/p2.jpg",
      price: 1500,
      countInStock: 10,
      brand: "Adidas",
      rating: 4.5,
      numReview: 10,
      description: "high quality shoe",
    },
    {
      name: "Mern Shoes",
      slug: "mern-slim-shoe",
      category: "Shoe",
      image: "/images/p3.jpg",
      price: 3510,
      countInStock: 10,
      brand: "Mern",
      rating: 4.5,
      numReview: 10,
      description: "high quality shoe",
    },
  ],
};

export default data;
