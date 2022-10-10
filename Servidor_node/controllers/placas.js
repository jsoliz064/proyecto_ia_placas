const express = require('express');
const router = express.Router();

router.get('/all', async (req, res) => {
    res.json("hola");
});

module.exports = router;