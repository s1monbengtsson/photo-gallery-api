import { Request, Response} from 'express'
import { validationResult } from 'express-validator'
import prisma from '../prisma'

/**
 * Get all photos
 */
export const index = async (req: Request, res: Response) => {

    try {
        const photos = await prisma.photo.findMany({
            where: {
                userId: req.token?.sub,
            }
        })

        res.status(200).send({
            status: "success",
            data: photos
        })
    } catch (err) {
        res.status(500).send({
            status: "error",
            message: "Unable to communicate with database"
        })
    }
}

/**
 * Get a single photo
 */
export const show = async (req: Request, res: Response) => {

    const photoId = Number(req.params.photoId)
    try {
        const photo = await prisma.photo.findFirst({
            where: {
                userId: req.token?.sub,
                id: photoId
            },
        })
        // if photo does not belong to logged in user, deny access
        if (!photo){
            return res.status(404).send({
                status: "fail",
                message: "could not find photo"
            })
        }
        res.status(200).send({
            status: "success",
            data: photo
        })
    } catch (err) {
        res.status(500).send({
            status: "fail",
            message: "Unable to communicate with database"
        })
    }
}

/**
 * Create a photo
 */
export const store = async (req: Request, res: Response) => {

    // check for validation errors
    const validationErrors = validationResult(req)
    if(!validationErrors.isEmpty()){
        return res.status(400).send({
            status: "fail",
            data: validationErrors.array()
        })
    }

    const { id, title, url, comment } = req.body

        // check if user has a token, otherwise deny access
        if (!req.token) {
            return res.status(401).send({
                status: "fail",
                message: "Authorization denied"
            })
        }

    try {
        const photo = await prisma.photo.create({
            data: {
               id,
               title,
               url,
               comment,
               userId: req.token.sub,
            },
        })
        res.status(201).send({
            status: "success",
            data: photo
        })
    } catch (err) {
        res.status(500).send({
            status: "error",
            message: "Unable to communicate with database"
        })
    }
}

/**
 * Update a photo
 */
export const updatePhoto = async (req: Request, res: Response) => {

    // check for validation errors
    const validationErrors = validationResult(req)
    if(!validationErrors.isEmpty()){
        return res.status(400).send({
            status: "fail",
            data: validationErrors.array()
        })
    }

    const photoId = Number(req.params.photoId)
    const { title, comment, url } = req.body

    try {
        // get photo by it's id
        const photo = await prisma.photo.findFirst({
            where: {
                id: Number(req.params.photoId)
            }
        })

        // check if the photo belongs to the authenticated user
        if (photo?.userId !== req.token?.sub) {
            return res.status(404).send({
                status: "fail",
                message: "Can not update an photo that does not exist"
            })
        }
        const result = await prisma.photo.update({
            where: {
                id: photoId,
            },
            data: {
                title,
                url,
                comment,
            }
        })
        res.status(200).send({
            status: "success",
            message: result
        })
    } catch (err) {
        res.status(500).send({
            status: "fail",
            message: "Unable to communicate with database"
        })
    }
}

/**
 * Delete a photo
 */
export const destroy = async (req: Request, res: Response) => {

    const photoId = Number(req.params.photoId)

    try {
        // get photo by it's id
        const photo = await prisma.photo.findFirst({
            where: {
                id: Number(req.params.photoId)
            }
        })

        // check if the photo belongs to the authenticated user
        if (photo?.userId !== req.token?.sub) {
            return res.status(404).send({
                status: "fail",
                message: "Can not delete a photo that does not exist"
            })
        }
        await prisma.photo.delete({
            where: {
                id: photoId
            },
        })
        res.status(200).send({
            status: "success",
            data: null
        })
    } catch (err) {
        res.status(500).send({
            status: "error",
            message: "Unable to communicate with database"
        })
    }
}