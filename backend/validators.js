const { body } = require('express-validator');

const validateProduct = [
    body('name').trim().isLength({ min: 1 }).escape().withMessage('Product name is required.'),
    body('description').optional({ checkFalsy: true }).trim().escape(),
    body('price').isFloat({ gt: 0 }).withMessage('Price must be a positive number.')
];

const validateClient = [
    body('name').trim().isLength({ min: 1 }).escape().withMessage('Client name is required.'),
    body('phone').optional({ checkFalsy: true }).trim().isMobilePhone().withMessage('Invalid phone number.'),
    body('car').optional({ checkFalsy: true }).trim().escape()
];

const validateReview = [
    body('name').trim().isLength({ min: 1 }).escape().withMessage('Reviewer name is required.'),
    body('text').trim().isLength({ min: 1 }).escape().withMessage('Review text is required.'),
    body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be an integer between 1 and 5.')
];

module.exports = {
    validateProduct,
    validateClient,
    validateReview
};
