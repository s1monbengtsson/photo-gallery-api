import { Request, Response} from 'express'
import { validationResult } from 'express-validator'
import prisma from '../prisma'

// get all albums
export const index = async (req: Request, res: Response) => {


    try {
        const albums = await prisma.album.findMany({
            where: {
                userId: req.token?.sub
            },
        })

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
        const album = await prisma.album.findFirst({
            where: {
                userId: req.token?.sub,
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

    const { title } = req.body

    // check if user has a token, otherwise deny access
    if (!req.token) {
        return res.status(401).send({
            status: "fail",
            message: "Authorization denied"
        })
    }

    try {
        const album = await prisma.album.create({
            data: {
                title,
                userId: req.token.sub
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

    // map over incoming photo_ids and store each one as an object in photoIds
	const photoIds = req.body.photo_ids.map( (photoId: Number) => {
		return {
			id: photoId,
		}
	})  

	try {
		const result = await prisma.album.update({
			where: {
				id: Number(req.params.albumId),
			},
			data: {
				photos: {
					connect: photoIds,
				}
			},
			include: {
				photos: true,
			}
		})
		res.status(200).send({
            status: "success",
            data: result
        })
	}catch (err) {
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


        const albumId = Number(req.params.albumId)
        const { title } = req.body
    
        try {
            const result = await prisma.album.update({
                where: {
                    id: albumId,
                },
                data: {
                    title
                }
            })
            res.status(200).send({
                status: "success",
                message: result
            })
        } catch (err) {
            res.status(500).send({
                status: "fail",
                message: "Could not update album"
            })
        }
    }


// remove a photo from an album
export const removePhoto = async (req: Request, res: Response) => {
    
        try {
            await prisma.album.update({
                where: {
                    id: Number(req.params.albumId)
                },
                data: {
                    photos: {
                        disconnect: {
                            id: Number(req.params.photoId)
                        }
                    }
                },
                include: {
                    photos: true
                }
            })
            res.status(200).send({
                status: "success",
                data: null
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