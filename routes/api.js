var express = require('express');
var router = express.Router();
var db = require('../models/models.js');

var messageUrl = '/message';
var messages = db.models.Message;

function makeUrl(req) {
  return 'http://' + req.headers.host + req.baseUrl + messageUrl;
}

function makeJsonObj(msg, req) {
  var jsonObj = msg.asJson;
  jsonObj.url = makeUrl(req) + "/" + msg.id;
  return jsonObj;
}

router.route(messageUrl)

  // Return the list of messages
  .get(function (req, res, next) {
    var query = {'attributes': ['id', 'message']};
    messages.findAll(query).then(
      (rows) => {
        let results = rows.map(function(msg) { 
            return { 'id': msg.id,
                     'message': msg.message,
                     'url': makeUrl(req) + "/" + msg.id};
        });
        res.json({'count': results.length, 'results': results});
      },
      (err) => res.json({'error': "An error occured when retrieving messages"})
    );
  })

  // Create a new message
  .post(function (req, res, next) {
    messages.create({'message': String(req.body.message)}).then(
      (newMsg) => res.json(makeJsonObj(newMsg, req)),
      (err) => res.json({'error': "An error occured when creating a message"})
    );
  });


router.route(messageUrl + "/:id")

  // Return the specified message details
  .get(function (req, res, next) {
    messages.findById(req.params.id, {rejectOnEmpty: true}).then(
      (msg) => res.json(makeJsonObj(msg, req)),
      (err) => res.json({'error': "Could not find requested message"})
    );
  })

  // Delete the specified message
  .delete(function (req, res, next) {
    messages.findById(req.params.id, {rejectOnEmpty: true}).then(
      (msg) => {
        msg.destroy();
        res.json({'success': "Message deleted successfully"});
      },
      (err) => res.json({'error': "Could not find requested message"})
    );
  });

module.exports = router;