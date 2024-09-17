const express = require('express');
const router = express.Router();
const sequelize = require('../../config/connection');

router.get('/', async (req, res) => {
    const data = await sequelize.query('SELECT * FROM users;').then((res) => res[0][0]);

    res.render('home', { data: data });
});

router.post('/', (req, res) => {
    res.send('post is here!');
});

module.exports = router;
