import express from 'express'

const router = express.Router()

// get all photos
router.get('/')

// get a single photo
router.get('/:photoId')

// create a new photo
router.post('/')

// update a photo
router.patch('/:photoId')

// delete a photo
router.delete('/:photoId')