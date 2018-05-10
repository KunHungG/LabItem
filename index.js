const linebot = require('linebot');
const express = require('express');
const rp = require('request-promise');
const bodyParser = require('body-parser');

const passcode = '121212';
const ME = 'Ue08d728ebd826941b468d24561ef64a7';

const SITE_NAME = '淡水';
const aqiOpt = {
    uri: "http://opendata2.epa.gov.tw/AQI.json",
    json: true
};

const bot = linebot({
    channelId: process.env.CHANNEL_ID,
    channelSecret: process.env.CHANNEL_SECRET,
    channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN
});

function readAQI(repos) {
    let data;

    for (i in repos) {
        if (repos[i].SiteName == SITE_NAME) {
            data = repos[i];
            break;
        }
    }

    return data;
}

const app = express();
app.set('view engine', 'ejs');

const linebotParser = bot.parser();

app.get('/', function(req, res) {
    rp(aqiOpt)
        .then(function(repos) {
            res.render('index', { AQI: readAQI(repos) });
        })
        .catch(function(err) {
            res.send("無法取得空氣品質資料～");
        });
});

app.get('/btn', function(req, res) {
    if (req.query.key !== passcode) {
        res.status(401).send('ERROR!');
    }

    let id = req.query.id;
    res.send("id: " + id);

    switch (id) {
        case 'wash_dish':
            bot.push(ME, {
                type: 'text',
                text: '女王呼喚：\n\n快去洗碗！！'
            });
            break;

        case 'candy':
            bot.push(ME, [{
                    type: 'text',
                    text: '零食櫃被打開了!'
                },
                {
                    type: 'image',
                    originalContentUrl: 'https://swf.com.tw/images/books/IoT/webcam_face_detection.png',
                    previewImageUrl: 'https://swf.com.tw/images/books/IoT/raspberry_pi.png'
                }
            ]);
            break;

        case 'air':
            let data, msg;
            rp(aqiOpt)
                .then(function(repos) {
                    data = readAQI(repos);
                    msg = data.County + data.SiteName +
                        '\n\nPM2.5指數：' + data["PM2.5_AVG"] +
                        '\n狀態：' + data.Status;

                    bot.push(ME, {
                        type: 'text',
                        text: msg
                    });
                })
                .catch(function(err) {
                    bot.push(ME, {
                        type: 'text',
                        text: '無法取得空氣品質資料～'
                    });
                });
            break;

    }

});

app.post('/linewebhook', linebotParser);

app.get('*', function(req, res) {
    res.status(404).send('找不到網頁！');
});

bot.on('message', function(event) {
    switch (event.message.type) {
        case 'text':
            if (events.message.text.indexOf('淡水空氣') > 0) {
                let data;
                rp(aqiOpt)
                    .then(function(repos) {
                        data = readAQI(repos);
                        event.reply(data.County + data.SiteName +
                            '\nPM2.5指數：' + data["PM2.5_AVG"] +
                            '\n狀態：' + data.Status);
                    })
                    .catch(function(err) {
                        event.reply('無法取得空氣品質資料～');
                    });
            }

            if (events.message.text.indexOf('吃什麼') > 0) {
                event.source.profile().then(function(profile) {
                    return event.reply('吃大便');
                });
            }

            if (events.message.text.indexOf('拉麵') > 0) {
                event.source.profile().then(function(profile) {
                    return event.reply('http://anikolife.com/ramen-lazybag/');
                });
                break;
            }

            if (events.message.text.indexOf('查詢') > 0) {
                event.source.profile().then(function(profile) {
                    return event.reply('https://www.google.com.tw/search?q=' + event.message.text.substr(3));
                });
                break;
            }
            /*
            switch (event.message.text) {
                case '空氣':
                    let data;
                    rp(aqiOpt)
                        .then(function(repos) {
                            data = readAQI(repos);
                            event.reply(data.County + data.SiteName +
                                '\nPM2.5指數：' + data["PM2.5_AVG"] +
                                '\n狀態：' + data.Status);
                        })
                        .catch(function(err) {
                            event.reply('無法取得空氣品質資料～');
                        });
                    break;
                case 'Me':
                    event.source.profile().then(function(profile) {
                        return event.reply('Hello ' + profile.displayName + ' ' + profile.userId);
                    });
                    break;
                case '美食':
                    event.source.profile().then(function(profile) {
                        return event.reply('https://www.google.com.tw/search?q=' + event.message.text);
                    });
                    break;
                case '拉麵':
                    event.source.profile().then(function(profile) {
                        return event.reply('http://anikolife.com/ramen-lazybag/');
                    });
                    break;
                case '吃什麼':
                    event.source.profile().then(function(profile) {
                        return event.reply('吃大便');
                    });
                    break;
                default:
                    
                    event.source.profile().then(function(profile) {
                        return event.reply(profile.displayName + '說：' + event.message.text);
                    });
                    
                    break;
            }
            */
            break;
        case 'sticker':
            /*
            event.reply({
                type: 'sticker',
                packageId: 1,
                stickerId: 1
            });
            */
            break;
        default:
            event.reply('Unknow message: ' + JSON.stringify(event));
            break;
    }
});

app.listen(process.env.PORT || 80, function() {
    console.log('LineBot is running.');
});