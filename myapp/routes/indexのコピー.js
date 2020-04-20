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

var express = require('express');
var router = express.Router();
var client = require('cheerio-httpcli');
var fs = require('fs');
//__dirnameの上下階層を指定するため必要
var path = require('path');
var param = {};


var request = require('request');
var URL = require('url');
//express4.16.0以降はbody-parser標準搭載
router.use(express.json())
router.use(express.urlencoded({ extended: true }));



/* GET home page. */
router.get('/', function(req, res, next) {


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

 //url_tx = Object.assign(req.body.url).toString();
if(req.body.url == url_tx || !req.body.url)
　  {
      res.render("index.ejs",
        {
        url: "",
        title: "",
        img: []
        });
     return false;
    }

url_tx = req.body.url;
 //url_tx = req.body.url;
 console.log(url_tx);

 //scrape -> ejsに結果反映 -> csv作成　の順で実施
 const result = await scrape();
 //処理完了後、promiseがok返してくる
 console.log(result);
 //console.log(img_tx)

 res.render('index.ejs',
 {
    	url: url_tx,
      title: title_tx,
      img: img_tx
 })

 csv();

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



function scrape()
{
  //処理待ちしたいコードを丸ごとpromiseで囲んでその中の待ちたい箇所でresolve
  return new Promise(resolve =>
 {


client.fetch(url_tx, param, function(err, $, res)
{
  if(err){ console.log("error"); return; }

  title=$('title').text();
  console.log(title);

  setup(resolve);

  title_tx=Object.assign(title).toString();
  $('h1,h2,h3,p,span').each(function (i,elem)
  {//txt scrape
   //txt_arr[i] = '{txt:' + '"' + result.$(elem).text() + '"' +  '}';
   txt_arr[i] = $(elem).text();
  });

  $("img").each(function(i,elem)
  {
console.log($(elem).attr('src'))

    var src = $(elem).attr('src');
    console.log(src)
    src = URL.resolve(url_tx, src);
    img_tx.push(Object.assign(src));

  cnt++;

    request(src).pipe(fs.createWriteStream(path_dl +"/"+ title + "_" + today +'/image' + cnt + '.png'));
  });
    console.log('ダウンロードが完了しました');
    //↓scrapeのawait。この処理をawaitする!!
    resolve("ok");
});



/*////////////////////////////////////
client.fetch(url_tx)
    .then( (result) =>
    {
       title=result.$('title').text();
       console.log(title);

       setup(resolve);

       //title scrape
       title_tx=Object.assign(title).toString();
       result.$('h1,h2,h3,p,span').each(function (i,elem)
       {//txt scrape
        //txt_arr[i] = '{txt:' + '"' + result.$(elem).text() + '"' +  '}';
        txt_arr[i] = result.$(elem).text();
       });
       //downloadマネージャーに全画像登録
       num=result.$('img').download();
       //2回目のscrapingでもここまでは正常
       //console.log(result.$('img'))
    })
    .catch((err) => {
        console.log(err);
        return;
    })
    .finally(() =>
 {
        console.log('終了');

        //txt_arr2.push({txt:title});
        //txt_arr2.push({txt:url});

//finally
  });
*/////////////////////////////////////

//promise
 })

//scrape
}

/*
const records = [
    {name: 'Bob',  lang: 'French, English'},
    {name: 'Mary', lang: 'English'},
    {name: 'Alef', lang: 'English', age:23},
];
*/





  function setup(resolve)
  {
   //dl managerの設定(全ダウンロードイベントがここでひとつずつ処理される)/////////////////////

   //　ディレクトリ存在チェック
   if (!fs.existsSync('../download'))
   {
   // ディレクトリを作成
   fs.mkdirSync('../download', (err, folder) => {
    if (err) throw err;
    console.log(folder);
    });
   }

  if (!fs.existsSync('../download/' + title + "_" + today))
  {
  fs.mkdirSync('../download/' + title + "_" + today , (err, folder) => {
  if (err) throw err;
  console.log(folder);
  });
  }

  path_dl=path.resolve(__dirname, '../../download');




/*////////client.downloadを使うと2,3度目のdownloadでどんどん重複downloadされたため断念///////////////

  //console.log(client.download);
  //client.download.clearCache();

  client.download
 .on('ready', function (stream) {
    cnt++;

    stream.pipe(fs.createWriteStream(path_dl +"/"+ title + "_" + today +'/image' + cnt + '.png'));
    console.log(stream.url.href + 'をダウンロードしました');
    console.log(this.state);
    console.log('url: ' + stream.url.href);
    console.log('type: ' + stream.type);
    console.log(stream.length);
    img_tx.push(Object.assign(stream.url.href));
*///////////////////////////////////////////////




    /* 未使用 if(client.download_eventsCount == 0)
    {
　　 stream.toBuffer(function (err, buffer) {
    fs.writeFileSync(path_dl +"/"+ title + "_" + today +'/image' + cnt + '.png', buffer, 'binary');
    });
    }else{return false} */
　　//img_tx += Object.assign(stream.url.href) +"<br><br>";




/*///////////////////////////////////////
  })
 .on('error', function (err) {
    console.error(err.url + 'をダウンロードできませんでした: ' + err.message);
  })
 .on('end', function () {
    console.log('ダウンロードが完了しました');
    //↓scrapeのawait。この処理をawaitする!!
    resolve("ok");
  });

   //並列ダウンロード制限の設定
  client.download.parallel = 4;
*///////////////////////////////////////


//setup
}





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


reset = function () {
  // リクエストヘッダ
  this.headers = {};
  // タイムアウトまでの時間(効いているかどうか不明)
  this.timeout = 30000;
  // gzip転送する/しない
  this.gzip = true;
  // Refererを自動設定する/しない
  this.referer = false;
  // <meta[http-equiv=refresh]>を検知してリダイレクトする/しない
  this.followMetaRefresh = false;
  // 受信を許可する最大のサイズ
  this.maxDataSize = null;
  // XML自動判別を使用しない
  this.forceHtml = false;
  // デバッグオプション
  this.debug = false;
client.reset();
}


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




