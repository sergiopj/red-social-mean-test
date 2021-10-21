// model
const User = require("../models/user.model");
const Follow = require("../models/follow.model");

// services
const jwt = require("../services/jwt");

// modules
const paginate = require("mongoose-pagination");

const addFollow = (req, res) => {
  const { followed } = req.body;
  const id = req.params.userid;

  if (id !== req.user.sub) {
    return res.status(500).send({
      ok: false,
      message: "No se pudo actualizar el usuario NO TIENES PERMISOS",
    });
  }

  const follow = new Follow();
  follow.user = id;
  follow.followed = followed;

  follow.save(follow, (err, updatedFollow) => {
    if (err) {
      return res.status(500).send({
        ok: false,
        message: "No se pudo actualizar el follow",
        err,
      });
    }
    return res.status(200).send({ ok: true, updated_follow: updatedFollow });
  });
};

// dejar de seguir a un usuario
const deleteFollow = (req, res) => {

}

module.exports = { addFollow, deleteFollow };
