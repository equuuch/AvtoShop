const express = require('express');
const postController = require('../controllers/postController');
const router = express.Router();

router.post('/posts', postController.addPost);
router.get('/posts', postController.getAllPosts);
router.put('/post/:id_service', postController.updatePost);
router.delete('/post/:id_service', postController.deletePost);

module.exports = router;
