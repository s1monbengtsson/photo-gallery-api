import express from "express"
import album from './album'
import photo from './photo'
import user from './user'
import resource from './_router'

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

router.use('/albums', album)

router.use('/photos', photo)

router.use('/register', user)

router.use('/login', user)

router.use('/refresh', user)

export default router
