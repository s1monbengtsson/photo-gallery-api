/**
 * Middleware for JWT authentication
 */
import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { JwtPayLoad} from '../types'

/**
 * Validate access token
 */

export const validateToken = (req: Request, res: Response, next: NextFunction) => {

    // check if authorization header exists
    if (!req.headers.authorization) {
        return res.status(401).send({
            status: "fail",
            message: "Authorization denied"
        })
    }

    // split authorization on space
    const [authSchema, token] = req.headers.authorization.split(" ")

    // check if authSchema is bearer
    if (authSchema.toLowerCase() !== "bearer") {
        return res.status(401).send({
            status: "fail",
            message: "Authorization denied"
        })
    }

    // verify token and attach payload to the request
    try {
        const payload = (jwt.verify(token, process.env.ACCESS_TOKEN_SECRET || "") as unknown) as JwtPayLoad

        req.token = payload

    } catch (err) {
        return res.status(401).send({
            status: "fail",
            message: "Authorization denied"
        })
    }

    next()
}