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

function readAQI(repos, mySite) {
    let data;

    for (i in repos) {
        if (repos[i].SiteName == mySite) {
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
            res.render('index', { AQI: readAQI(repos, SITE_NAME) });
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
        case 'body_enter':
            bot.push(ME, {
                type: 'text',
                text: '有人進來了！！'
            });
            break;
        case 'air':
            let data, msg;
            rp(aqiOpt)
                .then(function(repos) {
                    data = readAQI(repos, SITE_NAME);
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
            if (event.message.text.indexOf('查詢') != -1) {
                event.reply('https://www.google.com.tw/search?q=' + event.message.text.substr(event.message.text.indexOf('查詢') + 2).replace(/\s+/g, '+'));
            }

            if (event.message.text.indexOf('搜尋') != -1) {
                event.reply('https://www.google.com.tw/search?q=' + event.message.text.substr(event.message.text.indexOf('搜尋') + 2).replace(/\s+/g, '+'));
            }

            if (event.message.text.indexOf('空氣') != -1) {
                var mySite;
                let data;

                mySite = event.message.text.substr(0, event.message.text.indexOf('空氣'));
                rp(aqiOpt)
                    .then(function(repos) {
                        data = readAQI(repos, mySite.trim());
                        event.reply(data.County + data.SiteName +
                            '\nPM2.5指數：' + data["PM2.5_AVG"] +
                            '\n狀態：' + data.Status);
                    })
                    .catch(function(err) {
                        event.reply('無法取得空氣品質資料～');
                    });
            }

            if (event.message.text.indexOf('規劃課要注意聽啊') != -1) {
                event.reply('是~~~');
            }

            if (event.message.text.indexOf('吃什麼') != -1) {
                event.reply('除了大便，什麼都可以。');
            }

            if ((event.message.text.indexOf('掛') != -1 || event.message.text.indexOf('請') != -1 || event.message.text.toLowerCase().indexOf('hr') != -1) && (event.message.text.toLowerCase().indexOf(' off') != -1 || event.message.text.indexOf('小時') != -1)) {
                event.reply('不準，我要跟課長說你曠職！！');
            }
            event.source.profile().then(function(profile) {
                if (profile.displayName == '張秀玉Christine' && (event.message.text.toLowerCase().indexOf('watch dog') != -1 || event.message.text.indexOf('狗') != -1)) {
                    event.reply('小玉姐姐，妳總是那麼的年輕可愛！！');
                }

                if (profile.displayName == '張雅玲' && (event.message.text.toLowerCase().indexOf('watch dog') != -1 || event.message.text.indexOf('狗') != -1)) {
                    event.reply('雅玲姐姐，妳的眼睛似乎有比較大囉！！');
                }

                if (profile.displayName == '禾火糸韋' && (event.message.text.toLowerCase().indexOf('watch dog') != -1 || event.message.text.indexOf('狗') != -1)) {
                    event.reply('秋緯哥哥，你的髮型一直都是最有型的！！');
                }

                if (profile.displayName == 'Penny' && (event.message.text.toLowerCase().indexOf('watch dog') != -1 || event.message.text.indexOf('狗') != -1)) {
                    event.reply('Penny妹妹，妳的五月天每一首歌，都是經典中的經典，好聽到到讓我想 吹狗雷 吆嗚~~吆嗚~~~~！！');
                }

                if (profile.displayName == 'Vicky' && (event.message.text.toLowerCase().indexOf('watch dog') != -1 || event.message.text.indexOf('狗') != -1)) {
                    event.reply('Vicky姐姐，妳可以對我溫柔一點點！！');
                }

                if (profile.displayName == 'Monica' && (event.message.text.toLowerCase().indexOf('watch dog') != -1 || event.message.text.indexOf('狗') != -1)) {
                    event.reply('韻潔姐姐，妳好啊，妳好可愛啊！可是，妳怎麼都這麼晚下班呢？(心疼)');
                }

                if (profile.displayName == '曉筠' && (event.message.text.toLowerCase().indexOf('watch dog') != -1 || event.message.text.indexOf('狗') != -1)) {
                    event.reply('曉筠姐姐，妳好啊，妳好可愛啊！可是，妳怎麼都這麼晚下班呢？(心疼)');
                }

                if (profile.displayName == 'Oscar' && (event.message.text.toLowerCase().indexOf('watch dog') != -1 || event.message.text.indexOf('狗') != -1)) {
                    event.reply('Oscar姐姐，妳很漂亮唷，而且很厲害唷，完成了鐵人三項，真的是我心目中的女神唷 ^^');
                }

                if (profile.displayName == '幸枝' && (event.message.text.toLowerCase().indexOf('watch dog') != -1 || event.message.text.indexOf('狗') != -1)) {
                    event.reply('幸枝姐姐，很會畫畫唷，不過有時太Open了會怕怕的，哈。');
                }

                if (profile.displayName == 'Silver' && (event.message.text.toLowerCase().indexOf('watch dog') != -1 || event.message.text.indexOf('狗') != -1)) {
                    event.reply('Silver姐姐，很正唷很而且會騎車唷，看不出是兩個孩子的阿母唷，哈。');
                }

                if (profile.displayName == 'Ting (Kensi)' && (event.message.text.toLowerCase().indexOf('watch dog') != -1 || event.message.text.indexOf('狗') != -1)) {
                    event.reply('Ting (Kensi)姐姐，是女版的小野田，登山車就可以騎跟公路車一樣快唷 ^^。');
                }

                if (profile.displayName == '巧克力' && (event.message.text.toLowerCase().indexOf('watch dog') != -1 || event.message.text.indexOf('狗') != -1)) {
                    event.reply('巧克力姐姐，什麼時候開始騎公路車呢？ ^^');
                }

                if (profile.displayName == '林儒隆' && (event.message.text.toLowerCase().indexOf('watch dog') != -1 || event.message.text.indexOf('狗') != -1)) {
                    event.reply('小胖哥哥，會想要參加鐵人三項嗎？ ^^');
                }

                if (profile.displayName == 'pony' && (event.message.text.toLowerCase().indexOf('watch dog') != -1 || event.message.text.indexOf('狗') != -1)) {
                    event.reply('教練哥哥，很期待看看你的公路車唷。 ^^');
                }

                if (profile.displayName == '紀坤宏') {
                    if (event.message.text.toLowerCase().indexOf('watch dog') != -1 || event.message.text.indexOf('狗') != -1) {
                        event.reply('哇！紀哥哥 您這偉大 無敵 天才 的大發明家 ^^b');
                        //} else if (event.message.text.toLowerCase().indexOf('摩納哥') != -1) {
                        //    event.reply('http://www.monaco.com.tw/');
                    }

                    if (event.message.text.indexOf('摩納哥公設') != -1) {
                        event.reply('https://docs.google.com/spreadsheets/d/1Tq-vzHF0qlhmX2jdO86auwBxCt9VHp4bCucNqrVnHbk/edit#gid=0');
                    }
                }
            });
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
                default:
                    //event.source.profile().then(function(profile) {
                    //    return event.reply(profile.displayName + '說：' + event.message.text);
                    //});
                    break;
            }
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
            //event.reply('Unknow message: ' + JSON.stringify(event));
            break;
    }
});

app.listen(process.env.PORT || 80, function() {
    console.log('LineBot is running.');
});