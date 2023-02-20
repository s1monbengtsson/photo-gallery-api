import express from 'express'
import { index, updatePhoto, destroy, show, store } from '../controllers/photo_controller'
import { createPhotoRules } from '../validations/photo_rules'
import { updatePhotoRules } from '../validations/photo_rules'

const router = express.Router()

// get all photos
router.get('/', index)

// get a single photo
router.get('/:photoId', show)

// create a new photo
router.post('/', createPhotoRules, store)

// update a photo
router.patch('/:photoId', updatePhotoRules, updatePhoto)

// delete a photo
router.delete('/:photoId', destroy)

export default router