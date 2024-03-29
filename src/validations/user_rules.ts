/**
 * Validation rules for User
 */

import { body } from 'express-validator'
import { getUserByEmail } from '../services/user_service'

export const CreateUserRules = [
    body('first_name').isString().bail().withMessage('First name property has to be a string').bail().trim().isLength({min: 3}).withMessage('First name has to be at least 3 characters long'),
    body('last_name').isString().bail().withMessage('Last name property has to be a string').bail().trim().isLength({min: 3}).withMessage('Last name has to be at least 3 characters long'),
    body('email').isEmail().custom(async (data: string) => {

		// check if a user with that email already exists
		const user = await getUserByEmail(data)

		if (user) {
			// if user already exists, return and reject promise
			return Promise.reject("Email already exists")
		}
    }),
	body('password').isString().withMessage('Has to be a string').bail().trim().isLength({min: 6}).withMessage('Password has to be at least 6 characters long')
]