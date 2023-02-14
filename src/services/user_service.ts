import prisma from '../prisma'
import { CreateUserData, UpdateUserData } from '../types'

// new user
export const createUser = async (data: CreateUserData) => {
    return await prisma.user.create({
        data: data
    })
}

// get user by email
export const getUserByEmail = async (email: string) => {
    return await prisma.user.findUnique({
        where: {
            email: email 
        }
    })
}