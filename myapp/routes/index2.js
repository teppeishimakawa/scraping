//async:async付けるとPromiseを返すようになる
//await:Promiseを返す関数である必要あり。それ以降の処理を一時停止する
//await」は「async」で定義された関数の中だけでしか使えない


//cheerio-httpcli pattern
var url_tx="";
var title_tx="";
var title;
var img_tx=[];
var txt_arr=[];
var txt_arr2=[];
var cnt=0;
var today = new Date();
var records=[];
var num;
var path_dl;
var path_csv
var {createObjectCsvWriter} = require('csv-writer');
var csvfile;
var csvWriter;
var client = require('cheerio-httpcli');

/*
var constants = require('constants');  // <- constantsモジュールを別途インストール

client.set('agentOptions', {
  secureOptions: constants.SSL_OP_NO_TLSv1_2
});
*/

var express = require('express');
var router = express.Router();

var fs = require('fs');
//__dirnameの上下階層を指定するため必要
var path = require('path');

//express4.16.0以降はbody-parser標準搭載
router.use(express.json())
router.use(express.urlencoded({ extended: true }));

path_dl=path.resolve(__dirname, '../../download');

/* GET home page. */
router.get('/', function(req, res, next) {

//client.reset();
//client.download.clearCache();
//var client = require('cheerio-httpcli');


var request = require('request');
var URL = require('url');


url_tx = "https://yahoo.co.jp";
var param = {};




   if (!fs.existsSync('../download'))
   {
   // ディレクトリを作成
   fs.mkdirSync('../download', (err, folder) => {
    if (err) throw err;
    console.log(folder);
    });
   }

  if (!fs.existsSync('../download/' + today))
  {
  fs.mkdirSync('../download/'+ today , (err, folder) => {
  if (err) throw err;
  console.log(folder);
  });
  }



client.fetch(url_tx, param, function(err, $, res){
  if(err){ console.log("error"); return; }

  $("img").each(function(idx){
    var src = $(this).attr('src');
    src = URL.resolve(url_tx, src);

cnt++;

    request(src).pipe(fs.createWriteStream(path_dl +"/"+ today +'/image' + cnt + '.png'));
  });
});



/*


const main= async function()
{
  console.log(client.download);
  //client.download.clearCache();

  client.download
 .on('ready', function (stream) {

    stream.pipe(fs.createWriteStream(path_dl +"/"+'aaa.png',{ end: true}));
    /*
　　 stream.toBuffer(function (err, buffer) {
    fs.writeFileSync(path_dl +"/"+'aaa.png', buffer, 'binary');
    });
    */

/*
    console.log(stream.url.href + 'をダウンロードしました');
*/
    //stream.destroy();
    //stream.unpipe(fs.createWriteStream(path_dl +"/"+'aaa.png'));
    /*if(client.download_eventsCount == 0)
    {
　　 stream.toBuffer(function (err, buffer) {
    fs.writeFileSync(path_dl +"/"+ title + "_" + today +'/image' + cnt + '.png', buffer, 'binary');
    });
    }else{return false} */
　　//img_tx += Object.assign(stream.url.href) +"<br><br>";

/*
  })
 .on('error', function (err) {
    console.error(err.url + 'をダウンロードできませんでした: ' + err.message);
  })
 .on('end', function () {
    console.log('ダウンロードが完了しました');

  })

 //並列ダウンロード制限の設定
  client.download.parallel = 4;



url_tx = "https://yahoo.co.jp";
//fetchは自動でpromise返すがその次は自動で返さないのでreturnつける
const { $ } = await client.fetch(url_tx);
$('img').download();

}


main();

*/

/*
const records = [
    {name: 'Bob',  lang: 'French, English'},
    {name: 'Mary', lang: 'English'},
    {name: 'Alef', lang: 'English', age:23},
];
*/
 //client.reset();

    res.render("index.ejs",
        {
        url: "",
        title: "",
        img: []
        });

});



router.post("/", async(req, res) =>
{


      res.render("index.ejs",
        {
        url: "",
        title: "",
        img: []
        });

})



/*
setTimeout(function(){
res.render('index.ejs',
{
    	url: url_tx,
        title: title_tx,
        img: img_tx
})
},3000)
*/











    //////csv作成////////////////////////////////////
    function csv()
    {

        //csv用のオブジェクト作成。txt配列追加(ここでオブジェクト型の配列形成)。txt_arr2がオブジェクト用配列
        for(i=0;i<txt_arr.length;i++)
        {
        txt_arr2.push({txt:txt_arr[i]})
        };

        //pageUrl追加
    　  txt_arr2[0].ul=url_tx;
　　　　　//title追加
    　  txt_arr2[0].ttl=title_tx;
　　　　　//imgUrl配列追加
        for(j=0;j<img_tx.length;j++){txt_arr2[j].imgUrl=img_tx[j]}

        //const test = txt_arr.map(item =>  + item );

       path_csv=path.resolve(__dirname, '../../csv');

       //{createObjectCsvWriter} = require('csv-writer');
       csvfilepath = path_csv + "/" + title + "_" + today + '.csv'
       console.log(csvfilepath);
       csvWriter = createObjectCsvWriter({
       path: csvfilepath,
       header: [
         {id: 'ttl', title: 'title'},　 //Headerつける場合
         {id: 'ul', title: 'pageURL'},　 //Headerつける場合
         {id: 'txt', title: 'text'},　 //Headerつける場合
         {id: 'imgUrl', title: 'imgURL'}　 //Headerつける場合
        //'ttl','ul','txt','imgUrl' //Headerなしの場合
       ],
       encoding:'utf8',
       append :false, // append : no header if true
       });
       // Data for CSV
       records = txt_arr2;

    //Write CSV file
    csvWriter.writeRecords(records)       // returns a promise
    .then(() => {
        console.log('...Done');
    //処理完了後、配列を空に
       cnt=0;
        //ここでtxt_arr2を空にすると場合によってはエラー
        txt_arr=[];
        img_tx=[];
        //url_tx="";
        title_tx="";
        records=[];
        txt_arr2=[];
        
        //client.referer=false;
        //client.set('headers', {}, false);
        //client.set('headers', {referer: ''});



    });

   }
    ///////////////////////////////////////////////////////////
module.exports = router;

//////////////////////////////////////////////////////////////////////////////
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




