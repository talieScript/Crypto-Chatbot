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
 
    callSendAPI: function(sender_psid, response, cb) {
        let request_body = {
            "recipient": {
                "id": sender_psid
            },
            "message": response
        };
    
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
    },

    typing_on: function(sender_psid, response, cb) {

        let request_body = {
            "recipient": {
                "id": sender_psid
            },
            "sender_action": "typing_on"
        };
        
        request({
            "uri": "https://graph.facebook.com/v2.6/me/messages?access_token="+config.get('facebook.page.access_token'),
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
    },

    typing_off: function(sender_psid, response, cb) {

        let request_body = {
            "recipient": {
                "id": sender_psid
            },
            "sender_action": "typing_off"
        };
        
        request({
            "uri": "https://graph.facebook.com/v2.6/me/messages?access_token="+config.get('facebook.page.access_token'),
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
    },
}

module.exports = templates;