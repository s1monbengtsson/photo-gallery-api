import express from "express"
import album from './album'
import photo from './photo'
import user from './user'
import { register, login, refresh } from '../controllers/user_controller'
import { validateToken } from "../middlewares/jwt"

// instantiate a new router
const router = express.Router()

/**
 * GET /
 */
router.get('/', (req, res) => {
	res.send({
		message: "I AM API, BEEP BOOP",
	})
})

router.use('/albums', validateToken, album)

router.use('/photos', validateToken, photo)

router.use('/register', register)

router.use('/login', login)

router.use('/refresh', refresh)

export default router
