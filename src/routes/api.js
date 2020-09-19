const express = require("express");
const router = express.Router();

router.get('/test', (req, res) => {
  console.log('testing api works');
  res.send({});
});

module.exports = router;
