const app = require("./app");

// server config
const mongoose = require("mongoose");
const port = process.env.PORT || 3000;

// db connection
mongoose.Promise = global.Promise;

// db config
mongoose.set("useNewUrlParser", true);
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);
mongoose.set("useUnifiedTopology", true);

mongoose
  .connect('mongodb://localhost:27017/red-social-mean')
  .then(() => {
    // create server
    app.listen(port, () => {
        console.log('App arrancada en el puerto ', port)
    });
  })
  .catch((err) => {
      console.log('Error al arrancar la app: ', err)
  });
