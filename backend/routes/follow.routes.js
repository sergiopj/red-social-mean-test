const express = require("express");
const Router = express.Router();
const FollowController = require("../controllers/follow.controller");

const { check } = require("express-validator");
const { paramsValidator } = require("../middlewares/params-validator");
const { ensureAuth } = require("../middlewares/auth");

Router.post(
  "/follow/:userid",
  [
    check("userid", "El campo follow_id es obligatorio").not().isEmpty(),
    paramsValidator,
    ensureAuth,
  ],
  FollowController.addFollow
);

module.exports = Router;
