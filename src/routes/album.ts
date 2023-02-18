import express from 'express'
import { addPhoto, destroy, index, removePhoto, show, store, updateAlbum } from '../controllers/album_controller'
import { createAlbum, validatePhotoId } from '../validations/album_rules'
import { validateToken } from '../middlewares/jwt'

const router = express.Router()

// get all albums
router.get('/', index)

// get a sinlge album
router.get('/:albumId', show)

// create a new album
router.post('/', createAlbum, store)

// add a photo to an album
router.post('/:albumId/photos', validatePhotoId, addPhoto)

// update an album
router.patch('/:albumId', createAlbum, updateAlbum)

// remove a photo from an album
router.delete('/:albumId/photos/:photoId', removePhoto)

// delete an album
router.delete('/:albumId', destroy)

export default router