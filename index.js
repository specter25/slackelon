
const request = require('request');
const cheerio = require('cheerio');
let final='';
var URL = "https://twitter.com/elonmusk?ref_src=twsrc%5Egoogle%7Ctwcamp%5Eserp%7Ctwgr%5Eauthor";

const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
//const qs = require('qs');
const signature = require('./verifySignature');

const app = express();

const rawBodyBuffer = (req, res, buf, encoding) => {
  if (buf && buf.length) {
    req.rawBody = buf.toString(encoding || 'utf8');
  }
};

app.use(bodyParser.urlencoded({verify: rawBodyBuffer, extended: true }));
app.use(bodyParser.json({ verify: rawBodyBuffer }));

const server = app.listen(process.env.PORT || 5000, () => {
  console.log('Express server listening on port %d in %s mode', server.address().port, app.settings.env);
});



app.post('/gettweets', async (req, res) => {
  
    if(!signature.isVerified(req)) {
      res.sendStatus(404); // You may throw 401 or 403, but why not just giving 404 to malicious attackers ;-)
      return;
      
    } else {
  
          
      const blocks = [];
      const divider=	{
          "type": "divider"
      };
  
      request(URL, function (err, response, body) {
          if(err)
          {
              console.log(err);
          }
          else
          {
              let c=0
              let $ = cheerio.load(body);  //loading of complete HTML body
              $('li.stream-item').each(function(index){
                  c=c+1;
                  const text = $(this).find('p.tweet-text').text();
                  const name = $(this).find('.fullname').text();
                  if(c<=20)
                  {
                  final=`${final}${'\n'}${'\n'}${c}. name: ${name}${'\n'} text: ${text} `;
                  const block={
                      "type": "section",
                      "text": {
                          "type": "mrkdwn",
                          "text":`*<${URL}|${name}>*\n${c}'th tweet\n${text}`
                      },
                      "accessory": {
                          "type": "image",
                          "image_url": "https://cdn.britannica.com/54/188754-050-A3613741/Elon-Musk-2010.jpg",
                          "alt_text": "Windsor Court Hotel thumbnail"
                      }
                  };
                  // blocks.push(divider);
                  blocks.push(block);
                  blocks.push(divider);
                  // console.log('user : ' + name);   //name of the user
                  // console.log('tweet : ' + text);   //tweet content
                  // console.log('---------------------------------------------------------------------------------------------',c)
                  }
              });
              console.log(blocks);
              const message = {
                response_type: 'in_channel',
                //text: `${places[0].name}`,
                blocks: blocks
              }; 
              res.json(message);
          }
      }); 
       

      
    }
  });  