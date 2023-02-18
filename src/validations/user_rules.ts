/**
 * Validation rules for User
 */

import { body } from 'express-validator'
import { getUserByEmail } from '../services/user_service'

export const CreateUserRules = [
    body('first_name').isString().bail().withMessage('First name property has to be a string').bail().isLength({min: 2}),
    body('last_name').isString().bail().withMessage('Last name property has to be a string').bail().isLength({min: 2}),
    body('email').isEmail().custom(async (data: string) => {
		// check if a User with that email already exists
		const user = await getUserByEmail(data)

		if (user) {
			// user already exists, throw a hissy-fit
			return Promise.reject("Email already exists")
		}
    }),
	body('password').isString().withMessage('Has to be a string').bail().isLength({min: 6})
]