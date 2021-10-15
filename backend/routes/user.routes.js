const express = require("express");
const Router = express.Router();
const UserController = require("../controllers/user.controller");

const { check } = require("express-validator");
const { paramsValidator } = require("../middlewares/params-validator");
const { ensureAuth } = require("../middlewares/auth");
const multipart = require('connect-multiparty');
const multipartMiddleware = multipart();

Router.post(
  "/register",
  [
    check("name", "El campo name es obligatorio").not().isEmpty(),
    check("surname", "El campo surname es obligatorio").not().isEmpty(),
    check("nick", "El campo nick es obligatorio").not().isEmpty(),
    check("password", "El campo nick es obligatorio").not().isEmpty(),
    check("email", "El campo mail es obligatorio").isEmail(),
    paramsValidator,
  ],
  UserController.register
);

Router.post(
  "/login",
  [
    check("password", "El campo nick es obligatorio").not().isEmpty(),
    check("email", "El campo mail es obligatorio").isEmail(),
    paramsValidator,
    ensureAuth,
  ],
  UserController.login
);

Router.get(
  "/user/:id",
  [
    check("Authorization", "La Authorization es obligatoria").not().isEmpty(),
    paramsValidator,
    ensureAuth,
  ],
  UserController.getUser
);

Router.get(
  "/users/:page?/:itemsPage?/:orderBy?",
  [
    check("Authorization", "La Authorization es obligatoria").not().isEmpty(),
    paramsValidator,
    ensureAuth,
  ],
  UserController.getUsers
);
Router.put(
  "/user/:id",
  [
    check("Authorization", "La Authorization es obligatoria").not().isEmpty(),
    paramsValidator,
    ensureAuth,
  ],
  UserController.updateUser
);
Router.post(
  "/avatar/:userid",
  [
    check("Authorization", "La Authorization es obligatoria").not().isEmpty(),
    paramsValidator,
    ensureAuth,
    multipartMiddleware
  ],
  UserController.uploadImg
);

Router.get(
  "/avatar/:userid",
  [
    check("Authorization", "La Authorization es obligatoria").not().isEmpty(),
    paramsValidator,
    ensureAuth,
  ],
  UserController.getUserImg
);

module.exports = Router;
