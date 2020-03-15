const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const router = express.Router();

router.post('/getUrlData', async function(req, res, next) {
  const { url, divSelector } = req.body;
  try {
    const { data } = await axios(url);

    const $ = cheerio.load(data);
    // console.log(data);
    const result = $(divSelector);
    const contains = result.length > 0 ? true : false;
    res.json({ contains, result: result.toString() });
  } catch (e) {
    console.error(e);
  }
});

module.exports = router;
