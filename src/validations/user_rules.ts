/**
 * Validation rules for User
 */

import { body } from 'express-validator'
import { getUserByEmail } from '../services/user_service'

export const CreateUserRules = [
    body('name').isString().bail().withMessage('Name property has to be a string').bail().isLength({min: 2}),
    body('email').isEmail().custom(async (data: string) => {
		// check if a User with that email already exists
		const user = await getUserByEmail(data)

		if (user) {
			// user already exists, throw a hissy-fit
			return Promise.reject("Email already exists")
		}
    })
]