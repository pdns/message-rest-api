var path = require('path');
var utils = require('../utils');

var Sequelize = require('sequelize');
var dbOptions = {
  'dialect': 'sqlite', 
  'storage': path.join(__dirname, '..', 'database.sqlite')
};
if (process.env.NODE_ENV === 'test') {
  dbOptions.storage = ':memory:';
  dbOptions.logging = false;
}
var sequelize = new Sequelize(null, null, null, dbOptions);

sequelize.authenticate()
  .then(() => console.log("SQLite database opened successfully."))
  .catch(err => {
    console.error("An error occured when opening the SQLite database", err);
  });

var Message = sequelize.define('Message', {
  id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true
  },
  message: Sequelize.TEXT,

}, {
  getterMethods: {
    asJson() {
      return {
        'id': this.id,
        'message': this.message,
        'palindrome': utils.isPalindrome(this.message),
        'date_created': this.createdAt,
      };
    }
  },
});

module.exports = sequelize;