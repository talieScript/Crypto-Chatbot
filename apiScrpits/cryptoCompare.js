const request       = require('request'),
      config        = require('config'),
      bodyParser    = require('body-parser');

var cryptoCompare = {
    getCryptoPrice: function(cryptoCode, callback) {
                        let VERIFY_TOKEN = config.get('cryptoCompare.page.access_token')

                        request('https://min-api.cryptocompare.com/data/pricemulti?fsyms='+cryptoCode+',DASH&tsyms=GBP,USD,JPY&api_key='+VERIFY_TOKEN, function (error, response, body) {
                            if(error){
                                let data = {
                                    responce: "Somthing fucked with crypto request" 
                                };
                                return data;
                            }else{
                                if(response.statusCode === 200){
                                    let date = new Date().toUTCString();
                                    let parsedBody = JSON.parse(body);
                                    let data = parsedBody[cryptoCode];
                                    let prices = "Current "+cryptoCode+" price:"
                                                 +"\n"+"\n"+"£"+data.GBP.toString()+"\n\n"
                                                 +"¥"+data.JPY.toString()+"\n"+"\n"
                                                 +"$"+data.USD.toString()+"\n\n"+date;
                                    callback(prices);
                                }
                            }
                        });
                    }
}

module.exports = cryptoCompare;