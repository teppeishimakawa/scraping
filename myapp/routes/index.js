
//cheerio-httpcli pattern

var express = require('express');
var router = express.Router();
const client = require('cheerio-httpcli');
var fs = require('fs');
//__dirnameの上下階層を指定するため必要
const path = require('path');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


//ダウンロードマネージャーの設定(全ダウンロードイベントがここでひとつずつ処理される)/////////
var cnt=0;

client.download
.on('ready', function (stream) {

	cnt++;
	console.log(this.state);
	console.log('url: ' + stream.url.href);
    console.log('type: ' + stream.type);
    console.log(stream.length);
    stream.pipe(fs.createWriteStream('/Users/shimakawateppei/Documents/scraping2/download/image' + cnt + '.png'));
    console.log(stream.url.href + 'をダウンロードしました');
})
.on('error', function (err) {
    console.error(err.url + 'をダウンロードできませんでした: ' + err.message);
})
.on('end', function () {
    console.log('ダウンロードが完了しました');
});

//並列ダウンロード制限の設定
client.download.parallel = 4;
//////////////////////////////////////////////////////////////////////////////
var title;
var txt_arr=[];
var txt_arr2=[];
var url='https://cycles.wiki.fc2.com/wiki/%E3%82%B0%E3%83%AD%E3%83%BC%E3%82%92%E8%A1%A8%E7%8F%BE%E3%81%99%E3%82%8B%E6%96%B9%E6%B3%95/';


client.fetch(url)
    .then((result) =>
    {
       title=result.$('title').text();
       console.log(title);
       result.$('h1,h2,h3,p').each(function (i,elem)
       {
        //txt_arr[i] = '{txt:' + '"' + result.$(elem).text() + '"' +  '}';
        txt_arr[i] = result.$(elem).text();
       });
       //downloadマネージャーに全画像登録
       result.$('img').download();
    })
    .catch((err) => {
        console.log(err);
    })
    .finally(() =>
{
        console.log('終了');
        //txt_arr2.push({txt:title});
        //txt_arr2.push({txt:url});
        for(i=0;i<txt_arr.length;i++){txt_arr2.push({ttl:title,ul:url,txt:txt_arr[i]})};
        console.log(txt_arr2)

        //const test = txt_arr.map(item =>  + item );

     var path_csv=path.resolve(__dirname, '../../csv');
     var today = new Date();


     const {createObjectCsvWriter} = require('csv-writer');
     const csvfilepath = path_csv + "/" + title + "_" + today + '.csv'
     console.log(csvfilepath);
     const csvWriter = createObjectCsvWriter({
     path: csvfilepath,
     header: [
        // {id: 'name', title: 'NAME'},      //Headesrつける場合
        // {id: 'lang', title: 'LANGUAGE'}　 //Headerつける場合
        'ttl','ul','txt' //Headerなしの場合
    ],
    encoding:'utf8',
    append :false, // append : no header if true
    });
    // Data for CSV
    console.log(txt_arr);
    const records = txt_arr2;

    //Write CSV file
    csvWriter.writeRecords(records)       // returns a promise
    .then(() => {
        console.log('...Done');
    });

});

/*
const records = [
    {name: 'Bob',  lang: 'French, English'},
    {name: 'Mary', lang: 'English'},
    {name: 'Alef', lang: 'English', age:23},
];
*/




module.exports = router;



/*
const client = require('cheerio-httpcli');
var url='https://poulenc.eng.kagawa-u.ac.jp/Pub/KBIT/';
var word = 'SLP KBIT';


client.fetch(url, { q: word })
    .then((result) => {
    	//resultは検索ページ本体
        console.log(result.$('title').text());
        //検索ページ内のancherタグについて処理
        result.$('title').each(function () {
            var h3txt = result.$(this).find('h3').text();
            var url = result.$(this).attr('href');
            //console.log(h3txt);
            if (h3txt.includes('slp-kbit')) {
                console.log(h3txt + '  '  + url);
            }
        });
    })
    .catch((err) => {
        console.log(err);
    })
    .finally(() => {
        console.log('終了');
    });
 */




