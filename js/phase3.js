//雪だるまの画像を読み込む
(function () {

    //html ドキュメント上の canvas のインスタンスが格納される
    var canvas;
    // 2d コンテキストのインスタンスが格納される
    var ctx;
    //雪の結晶の image オブジェクトが格納される
    var img_snow;
    //雪だるまの image オブジェクトが格納される
    var img_snow_man;

    var requestId;

    //Document の準備ができたら
    document.addEventListener("DOMContentLoaded", function () {
        loadAssets();
    });

    //canvas 内に使用する画像をロード
    function loadAssets() {
        //HTML エレメント上の canvas のインスタンスを取得
        canvas = document.getElementById('myCanvas');
        //2d コンテキストを取得
        ctx = canvas.getContext('2d');


        //新しい image オブジェクトのインスタンスを生成
        img_snow = new Image();
        //image オブジェクトに画像をロード
        img_snow.src = '/img/snow.png';
        //image オブジェクトに画像がロードできたら
        img_snow.onload = function () {
            img_snow.x = getCenterPostion(canvas.clientWidth, img_snow.width);
            img_snow.y = 0;
            //canvas 上で image を描画
            ctx.drawImage(img_snow, img_snow.x, img_snow.y);
            
        };

        img_snow_man = new Image();
        img_snow_man.src = '/img/snow_man.png';
        img_snow_man.onload = function () {
            img_snow_man.x = getCenterPostion(canvas.clientWidth, img_snow_man.width);
            img_snow_man.y = canvas.clientHeight - img_snow_man.width;
            //canvas 上で image を描画
            ctx.drawImage(img_snow_man, img_snow_man.x, img_snow_man.y);
            startScece();
        };
    };

    function startScece() {
        //img_snow の y 値(縦位置) が canvas からはみ出たら先頭に戻す
        if (img_snow.y > canvas.clientHeight) { img_snow.y = 0 };
        //img_snow の y 値を増分
        img_snow.y += 2;
        //canvas をクリア
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        //画像を描画
        ctx.drawImage(img_snow, img_snow.x, img_snow.y);
        ctx.drawImage(img_snow_man, img_snow_man.x, img_snow_man.y);
        //ループを開始
        requestId = window.requestAnimationFrame(startScece);
    }

    //中央の Left 位置を求める関数
    function getCenterPostion(containerWidth, itemWidth) {
        return (containerWidth / 2) - (itemWidth / 2);
    };
})();