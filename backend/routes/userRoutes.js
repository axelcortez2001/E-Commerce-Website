import express from "express";
import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import { generateToken, isAuth } from "../utils.js";
import expressAsyncHandler from "express-async-handler";

const userRouter = express.Router();

userRouter.post(
  "/signin",
  expressAsyncHandler(async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      if (bcrypt.compareSync(req.body.password, user.password)) {
        res.json({
          _id: user._id,
          name: user.name,
          email: user.email,
          address: user.address,
          course: user.course,
          phoneNo: user.phoneNo,
          isSeller: user.isSeller,
          isAdmin: user.isAdmin,
          token: generateToken(user),
        });
        return;
      }
    }
    res.status(401).send({ message: "Invalid Email or password" });
  })
);

userRouter.post(
  "/signup",
  expressAsyncHandler(async (req, res) => {
    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      address: req.body.address,
      course: req.body.course,
      phoneNo: req.body.phoneNo,
      password: bcrypt.hashSync(req.body.password),
    });
    const user = await newUser.save();
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      address: user.address,
      course: user.course,
      phoneNo: user.phoneNo,
      isSeller: user.isSeller,
      isAdmin: user.isAdmin,
      token: generateToken(user),
    });
  })
);

userRouter.put(
  "/userprofile",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.address = req.body.address || user.address;
      user.course = req.body.course || user.course;
      user.phoneNo = req.body.phoneNo || user.phoneNo;
      if (req.body.password) {
        user.password = bcrypt.hashSync(req.body.password, 8);
      }

      const update = await user.save();
      res.send({
        _id: update._id,
        name: update.name,
        email: update.email,
        address: update.address,
        course: update.course,
        phoneNo: update.phoneNo,
        isSeller: update.isSeller,
        isAdmin: update.isAdmin,
        token: generateToken(update),
      });
    } else {
      res.status(404).send({ message: "USER NOT FOUND!" });
    }
  })
);

export default userRouter;
