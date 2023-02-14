/**
 * Type definitions
 */

export type CreateUserData = {
    first_name: string,
    last_name: string,
    email: string,
    password: string
}

export type UpdateUserData = {
	name?: string,
	email?: string,
	password?: string,
}