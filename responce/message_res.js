const express      = require("express"),
      app          = express(),
      var config = require('config');

const message_res_template = {
    price_res: function() {
        return {
        "attachment":{
            "type":"image", 
            "payload":{
              "is_reusable": true,
              "url":"http://www.messenger-rocks.com/image.jpg"
            }
          }
        }
    }
}

module.exports = message_res_template;   