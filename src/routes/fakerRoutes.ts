import { Hono } from 'hono'
import {
    getFaker,
} from '../controller/fakerController'
import { login, middleware } from '../controller/authController'
import { use } from 'hono/jsx'
import { jwtAuthMiddleware } from '../middleware/middlewareAuth'

const fakerRoutes = new Hono()

fakerRoutes.get('/generate-data', getFaker)

export default fakerRoutes
