import { Request, Response} from 'express'
import { validationResult } from 'express-validator'
import prisma from '../prisma'

/**
 * Get all albums
 */ 
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

/**
 * Get a single album
 */
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

        // if album does not belong to logged in user, reject access
        if (!album){
            return res.status(404).send({
                status: "fail",
                message: "Could not find album"
            })
        }
        res.status(200).send({
            status: "success",
            data: album
        })
    } catch (err) {
        res.status(500).send({
            status: "error",
            message: "Unable to communicate with database"
        })
    }
}

/**
 * Create a new album
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
        res.status(201).send({
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

/**
 * Add a photo to an album
 */
export const addPhoto = async (req: Request, res: Response) => {

    // check for validation errors
    const validationErrors = validationResult(req)
    if(!validationErrors.isEmpty()){
        return res.status(400).send({
            status: "fail",
            data: validationErrors.array()
        })
    }

    // map over incoming photo_ids and store each one as an object in photoIds
	const photoIds = req.body.photo_ids.map( (photoId: Number) => {
		return {
			id: photoId,
		}
	}) 

	try {
        // get album by it's id
        const album = await prisma.album.findFirst({
            where: {
                id: Number(req.params.albumId)
            }
        })
        // check if the album belongs to the authenticated user
        if (album?.userId !== req.token?.sub) {
            return res.status(401).send({
                status: "fail",
                message: "Can not add photos to an album that does not exist"
            })
        }

        // get photos from array that belong to the authenticated user
        const photos = await prisma.photo.findMany({
            where: {
                id: {
                    in: photoIds.map((photo: any) => photo.id)
                },
                userId: req.token?.sub
            },
        })

        // check if all photos belong to the authenticated user
        if (photos.length !== photoIds.length) {
            return res.status(401).send({
                status: "fail",
                message: "Can not add photos that do not exist"
            })
        }

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
    } catch (err) {
        res.status(500).send({
            status: "error",
            message: "Unable to communicate with database"
        })
    }
}

/**
 * Update an album
 */
export const updateAlbum = async (req: Request, res: Response) => {

    // check for validation errors
    const validationErrors = validationResult(req)
    if(!validationErrors.isEmpty()){
        return res.status(400).send({
            status: "fail",
            data: validationErrors.array()
        })
    }

    const albumId = Number(req.params.albumId)
    const { title } = req.body
    
    try {
        // get album by it's id
        const album = await prisma.album.findFirst({
            where: {
                id: Number(req.params.albumId)
            }
        })

        // check if the album belongs to the authenticated user
        if (album?.userId !== req.token?.sub) {
            return res.status(401).send({
                status: "fail",
                message: "Can not update an album that does not exist"
            })
        }
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
            data: result
        })
    } catch (err) {
        res.status(500).send({
            status: "error",
            message: "Unable to communicate with database"
        })
    }
}

/**
 * Remove photo from album
 */
export const removePhoto = async (req: Request, res: Response) => {
    
        try {
            // get album by it's id
        const album = await prisma.album.findFirst({
            where: {
                id: Number(req.params.albumId)
            }
        })

        // check if the album belongs to the authenticated user
        if (album?.userId !== req.token?.sub) {
            return res.status(401).send({
                status: "fail",
                message: "Can not remove an photo that does not exist"
            })
        }

        // get photo by it's id
        const photo = await prisma.photo.findFirst({
            where: {
                id: Number(req.params.photoId)
            }
        })

        // check if the album belongs to the authenticated user
        if (photo?.userId !== req.token?.sub) {
            return res.status(401).send({
                status: "fail",
                message: "Can not remove an photo that does not exist"
            })
        }
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
                message: "Unable to communicate with database"
            })
        }
    }

/**
 * Delete an album 
 */
export const destroy = async (req: Request, res: Response) => {

    const albumId = Number(req.params.albumId)

    try {
        // get album by it's id
        const album = await prisma.album.findFirst({
            where: {
                id: Number(req.params.albumId)
            }
        })

        // check if the album belongs to the authenticated user
        if (album?.userId !== req.token?.sub) {
            return res.status(401).send({
                status: "fail",
                message: "Can not delete an album that does not exist"
            })
        }
        await prisma.album.delete({
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
            message: "Unable to communicate with database"
        })
    }
}