var linebot = require('linebot');
var express = require('express');

var bot = linebot({
  channelId: 1542896075,
  channelSecret: "801e9a2ad703b8b3551f326d123d275d",
  channelAccessToken: "l/yx3P467vzQ+JmyjUY2SUJY/BX6dR0fCvwMCzxGFV0AXsQC/wlPUUJEiZCh7TLYV0b39J76eHvv8WV9P0ibDBDGxSDKVUjSQwcxTLjbEGRBR5oX/iRQU++q9K7/Dv+vttd+4SON0uq7J68RBsm0IgdB04t89/1O/w1cDnyilFU="
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
