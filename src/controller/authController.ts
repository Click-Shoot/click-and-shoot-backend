import { Hono } from "hono";
import { Context, Next } from "hono";
import { serve } from "@hono/node-server";
import { UserModel } from "../models/userModel";
import { jwt, sign as JwtSign, verify as Jwtverify } from "hono/jwt";
import { error } from "console";
import dotenv from "dotenv";
import bcrypt from 'bcrypt'
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET as string;

export const login = async (c: Context) => {
  try {
    const { email, password } = await c.req.json();
    const user = await UserModel.findOne({ email });

    if (!user) {
      return c.json({ message: "User not found" }, 404);
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return c.json({ message: "Invalid credentials" }, 401);
    }

     const token = await JwtSign({ sub: user._id, email: user.email,exp: Math.floor(Date.now() / 1000) + (60 * 60)}, JWT_SECRET);

    c.header('Authorization', `Bearer ${token}`);
    console.log("Token:", token);

    return c.json({ 
      success: true,
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email:  user.email,
        password:  user.password,
        description: user.description,
        rating: user.rating,
        tags: user.tags,
        stuff: user.stuff,
        slotsBooked: user.slotsBooked,
        isPhotograph: user.isPhotograph
      },
      token: token
    });
  } catch (error) {
    console.error("Login error:", error);
    return c.json({ message: "Error during login" }, 500);
  }
};

export const middleware = async (c: Context, n: Next) => {
  try {
    const authToken = c.req
      .header("Authorization")
      ?.replace("Bearer", "")
      .trim();
    if (!authToken) {
      return c.json({ error: "token pas trouver" }, 401);
    }
    let payload = null;  
    try {
      payload = await Jwtverify(authToken, JWT_SECRET);
    } catch (error) {
      return c.json({ message: error }, 401);
    }
    if (payload?.sub) {
      return await n();
    }
    return c.json({ message: "authenfication failed" }, 401);
  } catch (error) {
    console.error("Get user error:", error);
    return c.json({ message: "Error fetching users" }, 500);
  }
};
