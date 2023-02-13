import express from 'express'
import { index, updatePhoto, destroy, show, store } from '../controllers/photo_controller'

const router = express.Router()

// get all photos
router.get('/', index)

// get a single photo
router.get('/:photoId', show)

// create a new photo
router.post('/', store)

// update a photo
router.patch('/:photoId', updatePhoto)

// delete a photo
router.delete('/:photoId', destroy)

export default router