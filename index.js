var linebot = require('linebot');
var express = require('express');

var bot = linebot({
  channelId: 1542917941,
  channelSecret: "b55abd9aef3fd8a61a406a7e5a94dafe",
  channelAccessToken: "r+J3CKuHvZtW1x5eHCHM3z3SFnbGHbmFarHEpwm+TzPpE/swi54ye6l1DT8pe6leZe0fcSiMVO6ScXZpxft9TfnOpNQwc3mOdscmQW3IYYY0w+bK2sf5vUWaC6MNPtzgxNoqD/e9Y2xTX25eaov3FgdB04t89/1O/w1cDnyilFU="
});

bot.on('message', function(event) {
  if (event.message.type = 'text') {
    var msg = event.message.text;
    // event.reply(msg).then(function(data) {
    //   // success
    //   console.log(event);
    //   console.log(msg);
    // }).catch(function(error) {
    //   // error
    //   console.log('error');
    // });

    event.reply({
      type: 'location',
      title: 'my location',
      address: '〒150-0002 東京都渋谷区渋谷２丁目２１−１',
      latitude: 35.65910807942215,
      longitude: 139.70372892916203
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
