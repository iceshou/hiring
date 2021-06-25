const bodyParser = require('body-parser');
const registerRouter = require('./server/router');

module.exports = {
  devServer: {
    before(app) {
      app.use(bodyParser.json());
      app.use(bodyParser.urlencoded({ extended: false }));
      registerRouter(app);
    },
  },
};
