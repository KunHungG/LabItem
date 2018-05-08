var request = require('request');

const SITE_NAME = '淡水';
const opts = {
    uri: "http://opendata2.epa.gov.tw/AQI.json",
    json: true
};

request(opts, function(error, response, body) {
    if (!error && response.statusCode === 200) {
        let data;

        for (i in body) {
            if (body[i].SiteName == SITE_NAME) {
                data = body[i];
                break;
            }
        }

        console.log(data)
    }
});