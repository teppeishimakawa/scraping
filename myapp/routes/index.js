//async:この関数はPromiseを返すようになる
//await:Promiseを返す関数である必要あり。それ以降の処理を一時停止する
//await」は「async」で定義された関数の中だけでしか使えない


//cheerio-httpcli pattern
var title_tx="";
var img_tx="";
var url_tx="";


var title;
var txt_arr=[];
var txt_arr2=[];

var imgUrl_arr=[];


var express = require('express');
var router = express.Router();
const client = require('cheerio-httpcli');
var fs = require('fs');
//__dirnameの上下階層を指定するため必要
const path = require('path');
//express4.16.0以降はbody-parser標準搭載
router.use(express.json())
router.use(express.urlencoded({ extended: true }));



/* GET home page. */
router.get('/', function(req, res, next) {
    res.render("index.ejs",
        {
        url: "",
        title: "",
        img: ""
        });
});



router.post("/", async(req, res) =>
{
url_tx = Object.assign(req.body.url).toString();

 const result = await scrape();
console.log(result);

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
{var url=url_tx;
//処理待ちしたいコードを丸ごとpromiseで囲んでその中の待ちたい箇所でresolve
return new Promise(resolve =>
 {
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
    img_tx += Object.assign(stream.url.href) +"<br><br>";


 })
.on('error', function (err) {
    console.error(err.url + 'をダウンロードできませんでした: ' + err.message);
 })
.on('end', function () {
    console.log('ダウンロードが完了しました');
    //↓この処理をawaitする!!
    resolve("ok");
 });
//並列ダウンロード制限の設定
client.download.parallel = 4;
//////////////////////////////////////////////////////////////////////////////



client.fetch(url)
    .then((result) =>
    {
       title=result.$('title').text();
       console.log(title);
       //title scrape
       title_tx=Object.assign(title).toString();
       result.$('h1,h2,h3,p').each(function (i,elem)
       {//txt scrape
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

    

//finally
  });

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




module.exports = router;

var txt_arr3=[];

    //////csv作成////////////////////////////////////
    function csv()
    {

        imgUrl_arr=img_tx.split("<br><br>");
        //console.log(imgUrl_arr);

        //txt配列追加(ここでオブジェクト型の配列形成)
        for(i=0;i<txt_arr.length;i++)
        {
        txt_arr2.push({txt:txt_arr[i]})
        };

        //pageUrl追加
    　  txt_arr2[0].ul=url_tx;

　　　　　//title追加
    　  txt_arr2[0].ttl=title_tx;

　　　　　//imgUrl配列追加
        for(j=0;j<imgUrl_arr.length;j++)
        {
    　  txt_arr2[j].imgUrl=imgUrl_arr[j]
        }


　　　　


        console.log(txt_arr2);
        //const test = txt_arr.map(item =>  + item );

       var path_csv=path.resolve(__dirname, '../../csv');
       var today = new Date();

       const {createObjectCsvWriter} = require('csv-writer');
       const csvfilepath = path_csv + "/" + title + "_" + today + '.csv'
       console.log(csvfilepath);
       const csvWriter = createObjectCsvWriter({
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
       const records = txt_arr2;

    //Write CSV file
    csvWriter.writeRecords(records)       // returns a promise
    .then(() => {
        console.log('...Done');

    });
   }
    ///////////////////////////////////////////////////////////


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




