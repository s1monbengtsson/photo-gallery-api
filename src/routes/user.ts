import express from 'express'

const router = express.Router()

// register a new user
router.post('/register')

// login a user
router.post('/login')

// get a new access token
router.post('/refresh')