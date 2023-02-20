/**
 * Type definitions
 */

// type for creating a new user
export type CreateUserData = {
    first_name: string,
    last_name: string,
    email: string,
    password: string
}

// type for sending payload
export type JwtPayload = {
    sub: number,
    email: string,
    iat?: number,
    exp?: number
}