const express = require('express');
const router = express.Router();
const path = require("path");
const fs = require("fs");

router.get('/all', async (req, res) => {

    res.json("hola");
});

router.post('/upload', async (req, res) => {
    console.log(req);
});

module.exports = router;