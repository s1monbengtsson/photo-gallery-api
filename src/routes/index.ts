import express from "express"
import album from './album'
import photo from './photo'
import { register, login, refresh } from '../controllers/user_controller'
import { createUserRules } from "../validations/user_rules"
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

router.use('/register', createUserRules, register)

router.use('/login', login)

router.use('/refresh', refresh)

export default router
