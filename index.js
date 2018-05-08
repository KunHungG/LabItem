var linebot = require('linebot');
var express = require('express');

var bot = linebot({
    channelId: "1550113505",
    channelSecret: "001e56a4594b08a18a31ca87c1f5e2fb",
    channelAccessToken: "S7b/h+/vo3lZm15c8Lr//HAbj05jcWXLCD+sSi1wALDCEQzzyeo5oxK3ZZ6Ze7xjrS/6gjwIowxI8cxL/tWn3i9znf+p8YdVnXs3WkCij41IZ0+1NTSZm0RnzsV7hiEayvr7feFqGW8re8FmhukCdAdB04t89/1O/w1cDnyilFU="
});

bot.on('message', function(event) {
    if (event.message.type = 'text') {
        var msg = event.message.text;
        event.reply(msg).then(function(data) {
            // success 
            console.log(msg);
        }).catch(function(error) {
            // error 
            console.log('error');
        });
    }
});


const app = express();
const linebotParser = bot.parser();
app.post('/', linebotParser);

//因為 express 預設走 port 3000，而 heroku 上預設卻不是，要透過下列程式轉換
var server = app.listen(process.env.PORT || 8080, function() {
    var port = server.address().port;
    console.log("App now running on port", port);
});