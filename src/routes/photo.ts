import express from 'express'
import { index, updatePhoto, destroy, show, store } from '../controllers/photo_controller'
import { createPhoto } from '../validations/photo_rules'

const router = express.Router()

// get all photos
router.get('/', index)

// get a single photo
router.get('/:photoId', show)

// create a new photo
router.post('/', createPhoto, store)

// update a photo
router.patch('/:photoId', createPhoto, updatePhoto)

// delete a photo
router.delete('/:photoId', destroy)

export default router