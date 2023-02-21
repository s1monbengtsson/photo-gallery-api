/**
 * Validation for album
 */

import { body } from 'express-validator'

export const createAlbum = [
    body('title').isString().withMessage('Must be a string').bail().trim().isLength({min: 3}).withMessage('Title must be at least 3 characters long')
]

export const validatePhotoId = [
    body('photo_ids').isArray().withMessage('Has to be an array').isInt({min: 1}).withMessage('Must be a number')
]
