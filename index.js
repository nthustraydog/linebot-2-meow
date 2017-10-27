var linebot = require('linebot');
var express = require('express');
const fs = require('fs');
const uuid = require('uuid/v4');
const moment = require('moment');

var bot = linebot({
  channelId: 1542917941,
  channelSecret: "b55abd9aef3fd8a61a406a7e5a94dafe",
  channelAccessToken: "r+J3CKuHvZtW1x5eHCHM3z3SFnbGHbmFarHEpwm+TzPpE/swi54ye6l1DT8pe6leZe0fcSiMVO6ScXZpxft9TfnOpNQwc3mOdscmQW3IYYY0w+bK2sf5vUWaC6MNPtzgxNoqD/e9Y2xTX25eaov3FgdB04t89/1O/w1cDnyilFU="
});


function replyImage(event, reviseText = '') {
  if(reviseText) {
    event.reply({
        type: 'text',
        text: reviseText
    });
  }
  else {
    searchReply(event.message.text).then(text => {
      event.reply({
          type: 'text',
          text: text
      });
    });
  }
}

function searchReply(msg) {
  return new Promise((resolve, reject) => {
    if(!fs.existsSync('data-reply.json')) {
      fs.writeFileSync('data-reply', '');
    }

    fs.readFile('data-reply.json', 'utf8', (err, data) => {
        if (err) reject(err);

        let reply = data ? JSON.parse(data) : [];
        let exist = false;
        let text = '本喵不懂你/妳在說啥～';

        if (reply.length > 0) {
            reply = reply.filter(t => {
                if(t.text == msg) {
                  text = t.replyText;
                }
                return t.text == msg;
            });
        }

        resolve(text);
    });
  });
}

function list(searchText = '') {
  return new Promise((resolve, reject) => {
    if(!fs.existsSync('data-reply.json')) {
      fs.writeFileSync('data-reply.json', '');
    }

    fs.readFile('data-reply.json', 'utf8', (err, data) => {
        if (err) reject(err);

        let reply = data ? JSON.parse(data) : [];


        if (reply.length > 0 && searchText) {
            reply = reply.filter(t => {
                return t.text.toLowerCase().indexOf(searchText.toLowerCase()) !== -1
            });
        }

        resolve(reply);
    });
  });
}

function revise(searchText = '', reviseText) {
  return new Promise((resolve, reject) => {
    let exist = false;
    const newReply = {
      text: searchText,
      replyText: reviseText
    };

    list().then(reply => {
      reply = reply.map(t => {
        if(t.text === searchText){
            t.replyText = reviseText;
            exist = true;
          }
        return t;
      });

      if(!exist)
          reply.push(newReply);

      fs.writeFile('data-reply.json', JSON.stringify(reply), err => {
        if(err) reject(err);

        resolve(reply);
      });
    });
  });
}

bot.on('message', function(event) {
  console.log(event);
  if (event.message.type == 'text') {
    let msg = event.message.text;

    searchReply("閉嘴").then(text => {
      console.log(text);
        if(text === "0") {
          if(msg === "閉嘴")
            revise("閉嘴", "1");
          else if(msg[0] === "@" || msg[0] === "＠") {
            let cmd = msg.substring(1).split("：");

            revise(cmd[0], cmd[1]).then(reply => {
                replyImage(event, "好的好的 知道了");
            });
          }
          else
            replyImage(event);

        }
        else{
           if(msg === "啟動")
            revise("閉嘴", "0").then(reply => {
                replyImage(event, "我醒來了～");
            });
        }
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
