import { Request, Response} from 'express'
import { matchedData, validationResult,  } from 'express-validator'
import prisma from '../prisma'
import bcrypt from 'bcrypt'
import { createUser } from '../services/user_service'
import Debug from 'debug'


// register a new user
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
    const validatedData = req.body
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
            data: user
        })

    } catch (err) {
        res.status(500).send({
            status: "error",
            message: "Could not create a new user in database"
        })
    }
}

// log in a user
export const login = async (req: Request, res: Response) => {


}

// get a new access token
export const refresh = async (req: Request, res: Response) => {

}