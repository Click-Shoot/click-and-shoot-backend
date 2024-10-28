import { Hono } from 'hono'
import {
    getFaker,
} from '../controller/fakerController'
import { createGalleryForPhotographers } from '../controller/fakerController'

const fakerRoutes = new Hono()

// Définition des routes

fakerRoutes.get('/generate-data', getFaker)
fakerRoutes.get('/generate-gallery', async (c) => {createGalleryForPhotographers})




export default fakerRoutes
