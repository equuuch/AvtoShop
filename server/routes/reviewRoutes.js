const express = require('express');
const reviewsController = require('../controllers/reviewsController');

const router = express.Router();

router.get('/reviews', reviewsController.getAllReviews);
router.post('/reviews', reviewsController.addReview);

module.exports = router;
