import { Request, Response} from 'express'
import { matchedData, validationResult,  } from 'express-validator'
import prisma from '../prisma'
import bcrypt from 'bcrypt'
import { createUser, getUserByEmail } from '../services/user_service'
import jwt from 'jsonwebtoken'
import { JwtPayload } from '../types'


/**
 * register a new user
 */
export const register = async (req: Request, res: Response) => {

    // check for validation errors
    const validationErrors = validationResult(req)
    if(!validationErrors.isEmpty()) {
        return res.status(400).send({
            status: "fail",
            data: validationErrors.array()
        })
    }

    // get the validated data
    const validatedData = matchedData(req)
    console.log("validated data:", validatedData)

    // hash and salt incoming password
    const hashedPassword = await bcrypt.hash(validatedData.password, Number(process.env.SALT_ROUNDS) || 10)
    console.log("hashed pw:", hashedPassword)

    // set the hashed password as the new password
    validatedData.password = hashedPassword

    // store the registered user in database
    try {
        const user = await createUser({
            first_name: validatedData.first_name,
            last_name: validatedData.last_name,
            email: validatedData.email,
            password: validatedData.password
        })
        res.status(201).send({
            status: "success",
            data: {
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
            }
        })
    } catch (err) {
        res.status(500).send({
            status: "error",
            message: "Could not create a new user in database"
        })
    }
}

/**
 * login a user
 */
export const login = async (req: Request, res: Response) => {

    // destructure email and password from req.body
    const { email, password } = req.body

    // check if email is registered, and if not, bail
    const user = await getUserByEmail(email)
    if (!user) {
        return res.status(401).send({
            status: "fail",
            message: "No user with that email exists"
        })
    }

    // check if given credentials match the hashed ones, otherwise bail
    const result = await bcrypt.compare(password, user.password)
    if (!result) {
        return res.status(401).send({
            status: "fail",
            message: "Wrong email or password"
        })
    }

    // set up a jwt-payload
    const payload: JwtPayload = {
        sub: user.id,
        email: user.email
    }

    // check if user has secret access token, otherwise bail
    if(!process.env.ACCESS_TOKEN_SECRET){
        return res.status(500).send({
            status: "error",
            message: "No access_token_secret defined"
        })
    }

    // sign the payload with access token secret from .env
    const access_token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: process.env.ACCESS_TOKEN_LIFETIME || "1m"
    })

    // check if user has a refresh token
    if(!process.env.REFRESH_TOKEN_SECRET){
        return res.status(500).send({
            status: "error",
            message: "No refresh token defined"
        })
    }

    // sign payload with secret and give user access
    const refresh_token = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: process.env.REFRESH_TOKEN_LIFETIME || "1h"
    })

    // respond with access token
    res.send({
        status: "success",
        data: {
            access_token,
            refresh_token
        }
    })
}

/**
 * Get a refresh token and generate a new access token
 */
export const refresh = async (req: Request, res: Response) => {
    // check if authorization header exist
    if (!req.headers.authorization) {
        return res.status(401).send({
            status: "fail",
            message: "Authorization denied"
        })
    }

    // split authorization header on space
    const [authSchema, token] = req.headers.authorization.split(" ")

    // check if authorization header is bearer
    if (authSchema.toLowerCase() !== "bearer") {
        return res.status(401).send({
            status: "fail",
            message: "Authorization denied"
        })
    }

    // verify that refresh token is valid, and get payload
    try {
        const payload = (jwt.verify(token, process.env.REFRESH_TOKEN_SECRET ||  "") as unknown) as JwtPayload

        // delete issued at and expiry
        delete payload.iat
        delete payload.exp

        // check if user has access token secret
        if (!process.env.ACCESS_TOKEN_SECRET) {
            return res.status(500).send({
                status: "error",
                message: "No access token secret"
            })
        }
        // sign payload with access token secret and generate a new access token
        const access_token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: process.env.ACCESS_TOKEN_LIFETIME || "1h"
        })

        // send new access token
        res.send({
            status: "success",
            data: {
                access_token
            }
        })

    } catch (err) {
        return res.status(401).send({
            status: "fail",
            message: "Authorization denied"
        })
    }
}