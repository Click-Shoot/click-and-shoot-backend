import { Context, Next } from 'hono';
import { jwt, sign as JwtSign,verify as Jwtverify } from "hono/jwt";

const JWT_SECRET = process.env.JWT_SECRET as string;

// Middleware pour vérifier le JWT
export const jwtAuthMiddleware = async (c: Context, next: Next) => {
  const authHeader = c.req.header('Authorization');
  
  if (!authHeader) {
    return c.json({ message: 'Authorization header missing' }, 401);
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    return c.json({ message: 'Token missing' }, 401);
  }

  try {
    const decoded = Jwtverify(token, JWT_SECRET);
    
    c.set('user', decoded);

    await next();
  } catch (error) {
    console.error('Token verification error:', error);
    return c.json({ message: 'Invalid token' }, 403);
  }
};
