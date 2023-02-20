/**
 * Validation for photo
 */

import { body } from 'express-validator'

export const createPhotoRules = [
    body('title').isString().withMessage('Title must be a string').bail().isLength({min: 3}).withMessage('Title has to be at least 3 characters long'),
    body('url').isString().isURL().withMessage('Must be a valid url'),
    body('comment').isString().withMessage('Comment must be a string').bail().isLength({min: 3}).withMessage('Comment must be at least 3 characters long')
]

export const updatePhotoRules = [
    body('title').optional().isString().withMessage('Title must be a string').bail().isLength({min: 3}).withMessage('Title has to be at least 3 characters long'),
    body('url').optional().isString().isURL().withMessage('Must be a valid url'),
    body('comment').optional().isString().withMessage('Comment must be a string').bail().isLength({min: 3}).withMessage('Comment must be at least 3 characters long')
]