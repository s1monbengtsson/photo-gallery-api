import express from 'express'
import { login, refresh, register } from '../controllers/user_controller'
import { CreateUserRules } from '../validations/user_rules'

const router = express.Router()

// register a new user
router.post('/', CreateUserRules, register)

// login a user
router.post('/', login)

// get a new access token
router.post('/', refresh)

export default router