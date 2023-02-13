import { Request, Response} from 'express'
import { validationResult } from 'express-validator'
import prisma from '../prisma'

// get all photos
export const index = async (req: Request, res: Response) => {

    try {
        const photos = await prisma.photo.findMany()

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

// get a single photo
export const show = async (req: Request, res: Response) => {

    const photoId = Number(req.params.photoId)
    try {
        const photo = await prisma.photo.findUniqueOrThrow({
            where: {
                id: photoId
            },
        })
        res.status(200).send({
            status: "success",
            data: photo
        })
    } catch (err) {
        res.status(404).send({
            status: "fail",
            message: "Could not find photo"
        })
    }
}

// post a new photo
export const store = async (req: Request, res: Response) => {

    // check for validation errors

    const { id, title, url, comment, userId } = req.body

    try {
        const photo = await prisma.photo.create({
            data: {
               id,
               title,
               url,
               comment,
               userId,
            },
        })
        res.status(200).send({
            status: "success",
            data: photo
        })
    } catch (err) {
        res.status(500).send({
            status: "fail",
            message: "Could not create photo"
        })
    }
}

// update a photo
export const updatePhoto = async (req: Request, res: Response) => {

    const photoId = Number(req.params.photoId)
    const { title, comment } = req.body

    try {
        const result = await prisma.photo.update({
            where: {
                id: photoId,
            },
            data: {
                title,
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
            message: "Could not update photo"
        })
    }
}

// delete a photo
export const destroy = async (req: Request, res: Response) => {

    const photoId = Number(req.params.photoId)

    try {
        const photo = await prisma.photo.delete({
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
            message: "Could not delete photo"
        })
    }
}