var rp = require('request-promise');

const SITE_NAME = '淡水';
const opts = {
    uri: "http://opendata2.epa.gov.tw/AQI.json",
    json: true
};

rp(opts)
    .then(function(repos) {
        let data;

        for (i in repos) {
            if (repos[i].SiteName == SITE_NAME) {
                data = repos[i];
                break;
            }
        }
        console.log(data);
    })
    .catch(function(err) {
        console.log('出錯了～找不到指定資源…');
    });