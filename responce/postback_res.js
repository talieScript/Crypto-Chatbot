const config = require('config'),
      express = require('express'),
      app = express();

const templates = {

    askTemplate: function(text) {
        return {
            "attachment":{
                "type":"template",
                "payload":{
                    "template_type":"button",
                    "text": text,
                    "buttons":[
                        {
                            "type":"postback",
                            "title":"BTC",
                            "payload":"BTC"
                        },
                        {
                            "type":"postback",
                            "title":"ETH",
                            "payload":"ETH"
                        },
                        {
                            "type":"postback",
                            "title":"LTC",
                            "payload":"LTC"
                        }
                    ]
                }
            }
        }
    },
 
    // Sends response messages via the Send API
    callSendAPI: function(sender_psid, response, cb) {
        // Construct the message body
        let request_body = {
            "recipient": {
                "id": sender_psid
            },
            // "sender_action": "typing_on",
            "message": response
        };
    
        // Send the HTTP request to the Messenger Platform
        request({
            "uri": "https://graph.facebook.com/v2.6/me/messages",
            "qs": { "access_token": config.get('facebook.page.access_token') },
            "method": "POST",
            "json": request_body
        }, (err, res, body) => {
            if (!err) {
                if(cb){
                    cb();
                }
            } else {
                console.error("Unable to send message:" + err);
            }
        });
    }
}

module.exports = templates;