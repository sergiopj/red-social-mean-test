// model
const User = require("../models/user.model");

// services
const jwt = require("../services/jwt");

// modules
const bcrypt = require("bcrypt-nodejs");
const fs = require("fs");
const path = require("path");

const register = (req, res) => {
  const params = req.body;

  // si existe el email o username no se puede registrar
  User.find({ $or: [{ email: params.email }, { nick: params.nick }] }).exec(
    (err, user) => {
      if (err) {
        return res.status(500).send({
          ok: false,
          error: err.message,
          message: "No se ha podido registrar el usuario",
        });
      }
      if (user.length < 1) {
        bcrypt.hash(params.password, null, null, (err, hash) => {
          if (err) {
            return res.status(500).send({
              ok: false,
              error: err.message,
              message: "No se ha podido registrar el usuario",
            });
          }
          if (hash) {
            const newUser = new User({
              ...params,
            });
            newUser.password = hash;
            newUser.role = "ROLE_USER";
            newUser.save((err, userStored) => {
              if (userStored) {
                userStored.password = undefined;
                return res.status(200).send({ ok: true, user: userStored });
              }
            });
          }
        });
      } else {
        return res.status(404).send({
          ok: true,
          message: "El nick o email del usuario ya existe",
        });
      }
    }
  );
};

const login = (req, res) => {
  const { email, password, getToken } = req.body;

  User.findOne({ email }, (err, user) => {
    if (err) {
      return res.status(500).send({
        ok: false,
        message: "No se pudo obtener el email del user en la bd",
        err,
      });
    }
    if (user !== null) {
      bcrypt.compare(password, user.password, async (err, check) => {
        if (err) {
          return res.status(500).send({
            ok: false,
            message: "No se pudo comparar el password del user en la bd",
            err,
          });
        }
        let webtoken;
        if (getToken) {
          console.log("web token???");
          webtoken = await jwt.generateJWT(user);
        }
        return res.status(200).send({
          logged: check ? true : false,
          token: check && getToken ? webtoken : undefined,
        });
      });
    }
  });
};

const getUser = (req, res) => {
  const { id } = req.params;

  User.findById(id, (err, user) => {
    if (err) {
      return res.status(500).send({
        ok: false,
        message: "No se pudo obtener el usuario",
        err,
      });
    }

    if (!user) {
      return res.status(404).send({
        ok: true,
        message: "El usuario no existe",
      });
    }

    return res.status(200).send({ ok: true, user });
  });
};

const getUsers = (req, res) => {
  const { page, itemsPerPage } = req.body;

  User.find()
    .sort("_id")
    .paginate(parseInt(page), parseInt(itemsPerPage), (err, users, total) => {
      if (err) {
        return res.status(500).send({
          ok: false,
          message: "No se pudieron obtener los usuarios",
          err,
        });
      }

      if (!users[0]) {
        return res.status(404).send({
          ok: true,
          message: "No existen usuarios en la bd",
        });
      }

      const filterUsers = users.map((user) => {
        user.password = undefined;
        return user;
      });

      return res.status(200).send({ ok: true, users: filterUsers, total });
    });
};

const updateUser = (req, res) => {
  const { id } = req.params;
  const update = req.body;

  if (id !== req.user.sub) {
    return res.status(500).send({
      ok: false,
      message: "No se pudo actualizar el usuario NO TIENES PERMISOS",
    });
  }

  User.findByIdAndUpdate(id, update, { new: true }, (err, user) => {
    if (err) {
      return res.status(500).send({
        ok: false,
        message: "No se pudo actualizar el usuario",
        err,
      });
    }

    if (!user) {
      return res.status(404).send({
        ok: true,
        message: "El usuario a actualizar no existe",
      });
    }

    return res.status(200).send({ ok: true, user });
  });
};

// TODO se sube una imagen a disco y se añade al campo img del usuario en la bd
const uploadImg = (req, res) => {

  const userId = req.params.userid;
  const {type, size, path} = req.files.image;

  if (userId !== req.user.sub) {
    return res.status(500).send({
      ok: false,
      message: "No se pudo subir la imagen NO TIENES PERMISOS",
    });
  }

  if (!req.files) {
    return res.status(404).send({
      ok: false,
      message: "No se ha subido una imagen valida",
    });
  }

   // validar extension
   const validExt = ['jpeg','png','gif','jpg'];

   if(!validExt.includes(type.split('/')[1])) {
     return res.status(404).send({
       ok: false,
       message: "No se ha subido una imagen con extension valida",
       allowExt: ['jpeg','png', 'jpg', 'gif']
     });
   }

   // no permitidas imagenes de mas de 10 megas
   if(size > 10000) {
    return res.status(404).send({
      ok: false,
      message: "Imagen demasiado pesada",
      maxSize: "10 megas"
    });
  }

 
  // guardamos la imagen en disco
  const avatarPath = "./assets/imgs/avatar";

  fs.copyFileSync(path, `${avatarPath}/${userId}.${type.split('/')[1]}`, err => {
    if (err) {
      return res.status(500).send({
        ok: false,
        message: "No se pudo guardar la imagen",
        err,
      });
    }
  });

  // guardamos en la bd el name de la imagen del usuario (id)
  User.findByIdAndUpdate(userId, {image: `${userId}.${type.split('/')[1]}`}, { new: true }, (err, user) => {
    if (err) {
      return res.status(500).send({
        ok: false,
        message: "No se pudo actualizar el usuario",
        err,
      });
    }
    if (!user) {
      return res.status(404).send({
        ok: true,
        message: "El usuario a actualizar no existe",
      });
    }
    return res.status(200).send({ ok: true, user });
  });
};

const getUserImg = (req, res) => {

  const userId = req.params.userid;

  if (userId !== req.user.sub) {
    return res.status(500).send({
      ok: false,
      message: "No se pudo obtener la imagen NO TIENES PERMISOS",
    });
  }

  User.findById(userId, (err, user) => {
    if (err) {
      return res.status(500).send({
        ok: false,
        message: "No se pudo obtener la img del usuario",
        err,
      });
    }
    res.sendFile(path.resolve('./assets/imgs/avatar/'+ user.image), err => {
      if (err) {
        return res.status(500).send({
          ok: false,
          message: "No se pudo descargar la img del usuario",
          err: err.message,
        });
      }
    })
  })
}

module.exports = {
  register,
  login,
  getUser,
  getUsers,
  updateUser,
  uploadImg,
  getUserImg
};
