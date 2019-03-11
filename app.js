const express       = require('express'),
      app           = express()
      request       = require('request'),
      bodyParser    = require('body-parser'),
      config        = require('config');

const postback_res  = require('./responce/postback_res.js'),
      cryptoCompare = require('./apiScrpits/cryptoCompare.js')
      

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.set("view engine", "ejs");

app.get("/", function(req,res){
    res.render("index")
});

// basic price request
// app.get("/api_request", function(req, res){
//     request('https://min-api.cryptocompare.com/data/pricemulti?fsyms=BTC,DASH&tsyms=GBP,USD,JPY&api_key=f85fd2078a7e2165d803dbd397373d4dfb6672559b0e5e731bdf3f59cf156c37', function (error, response, body) {
//         if(error){
//             let data = {
//                 responce: "Somthing fucked with crypto request" 
//             };
//             res.send(data);
//         }else{
//             if(response.statusCode === 200){
//                 let parsedBody = JSON.parse(body);
//                 let data = {
//                     response: parsedBody,
//                 }
//                 res.send(data)
//             }
//         }
//     });
// });

// Adds support for GET requests to our webhook
app.get('/webhook', function(req, res) {
 
    // Your verify token. Should be a random string.
    let VERIFY_TOKEN = config.get('facebook.page.access_token');
 
    // Parse the query params
    let mode = req.query['hub.mode'];
    let token = req.query['hub.verify_token'];
    let challenge = req.query['hub.challenge'];
 
    // Checks if a token and mode is in the query string of the request
    if (mode && token) {
 
        // Checks the mode and token sent is correct
        if (mode === 'subscribe' && token === VERIFY_TOKEN) {
 
            // Responds with the challenge token from the request
            console.log('WEBHOOK_VERIFIED');
            res.status(200).send(challenge);
 
        } else {
            // Responds with '403 Forbidden' if verify tokens do not match
            res.sendStatus(403);
        }
    }
});

// Creates the endpoint for our webhook
app.post('/webhook', function(req, res) {
 
    let body = req.body;
 
    if (body.object === 'page') {
 
        // Iterates over each entry - there may be multiple if batched
        body.entry.forEach(function(entry) {
            let webhook_event = entry.messaging[0];
            // Get the sender PSID
            let sender_psid = webhook_event.sender.id;
            console.log('Sender PSID: ' + sender_psid);
            if (webhook_event.message) {
                console.log("message")
                handleMessage(sender_psid, webhook_event.message)
            } else if (webhook_event.postback) {
                console.log("postback")
                handlePostback(sender_psid, webhook_event.postback)
            }
        });
        // Returns a '200 OK' response to all requests
        res.status(200).send('EVENT_RECEIVED');
    } else {
        // Returns a '404 Not Found' if event is not from a page subscription
        res.sendStatus(404);
        console.log("nope")
    }
 
});

// Handles messages events
const handleMessage = function(sender_psid, received_message) {
    let response;
    let payload = received_message.text;
 
    function talk(prices){
            response = postback_res.askTemplate(prices)
            postback_res.callSendAPI(sender_psid, response);
        }
    cryptoCompare.getCryptoPrice(payload, talk);
}

 
// Hnadles postback events
const handlePostback = function(sender_psid, received_postback) {
    let response;
    let payload = received_postback.payload;
 
    if(payload === 'GET_STARTED'){
        response = postback_res.askTemplate('To start pick a crypto currency to hear the latest price');
        postback_res.callSendAPI(sender_psid, response);
    } else if(payload === 'MORE'){
        
    }
    else {
        function talk(prices){
            response = postback_res.askTemplate(prices)
            postback_res.callSendAPI(sender_psid, response);
        }
        cryptoCompare.getCryptoPrice(payload, talk);
    }
}

app.listen("8000", function(){
    console.log("app has started!!")
});
