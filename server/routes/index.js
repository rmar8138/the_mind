const express = require("express");
const router = express.Router();

// enable cors
router.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000/"); // update to match the domain you will make the request from
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

router.get("/api", (req, res) => res.send("hello"));

module.exports = router;
