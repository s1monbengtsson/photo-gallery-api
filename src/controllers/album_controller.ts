import { Request, Response} from 'express'
import { validationResult } from 'express-validator'
import prisma from '../prisma'

// get all albums
export const index = async (req: Request, res: Response) => {

    try {
        const albums = await prisma.album.findMany()

        res.status(200).send({
            status: "success",
            data: albums
        })
    } catch (err) {
        res.status(500).send({
            status: "error",
            message: "Unable to communicate with database"
        })
    }
}

// get a single album
export const show = async (req: Request, res: Response) => {

    const albumId = Number(req.params.albumId)
    try {
        const album = await prisma.album.findUniqueOrThrow({
            where: {
                id: albumId
            },
            include: {
                photos: true
            }
        })
        res.status(200).send({
            status: "success",
            data: album
        })
    } catch (err) {
        res.status(404).send({
            status: "fail",
            message: "Could not find album"
        })
    }
}

// create a new album
export const store = async (req: Request, res: Response) => {

    // check for validation errors

    const { id, title, userId } = req.body

    try {
        const album = await prisma.album.create({
            data: {
                title,
                userId,
                id,
            }
        })
        res.status(200).send({
            status: "success",
            data: album
        })
    } catch (err) {
        res.status(500).send({
            status: "fail",
            message: "Could not create album"
        })
    }
}

// add a photo to an album
export const addPhoto = async (req: Request, res: Response) => {

    const photoId = req.body.photoId

    try {
        const result = await prisma.album.update({
            where: {
                id: Number(photoId)
            },
            data: {
                photos: {
                    connect: photoId
                }
            },
            include: {
                photos: true
            }
        })
        res.status(200).send({
            status: "success",
            data: result
        })
    } catch (err) {
        res.status(500).send({
            status: "error",
            message: "Could not add photo to album"
        })
    }
}

// update an album
export const updateAlbum = async (req: Request, res: Response) => {

    // check for validation errros

    // get only the validated data from req

}

// remove a photo from an album
export const removePhoto = async (req: Request, res: Response) => {

        const photoId = req.body.photoId
    
        try {
            const result = await prisma.album.update({
                where: {
                    id: Number(req.params.photoId)
                },
                data: {
                    photos: {
                        disconnect: photoId
                    }
                },
                include: {
                    photos: true
                }
            })
            res.status(200).send({
                status: "success",
                data: result
            })
        } catch (err) {
            res.status(500).send({
                status: "error",
                message: "Could not remove photo from album"
            })
        }
    }

// delete an album
export const destroy = async (req: Request, res: Response) => {

    const albumId = Number(req.params.albumId)

    try {
        const album = await prisma.album.delete({
            where: {
                id: albumId
            },
        })
        res.status(200).send({
            status: "success",
            data: null
        })
    } catch (err) {
        res.status(500).send({
            status: "error",
            message: "Could not delete album"
        })
    }
}