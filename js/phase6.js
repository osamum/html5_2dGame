//当たり判定
(function () {


    //ゲーム内で動作する Sprite クラス
    var Sprite = function (imgSrc) {
        var that = this;
        that.imageLoaded = false;
        that.imageSource = imgSrc;
        that.x = 0;
        that.y = 0;
        that.dx = 0;
        that.dy = 0;

        //新しい image オブジェクトのインスタンスを生成
        var img = new Image();
        //image オブジェクトに画像をロード
        img.src = imgSrc;
        //画像がロードされたら
        img.onload = function () {
            that.imageLoaded = true;
            that.width = img.width;
            that.height = img.height;
            that.image = img;
        };
    };

    //Sprite を格納する配列
    var snow_sprites = [];

    //矢印キーのコード
    var LEFT_KEY_CODE = 37;
    var RIGHT_KEY_CODE = 39;
    var key_value = 0;

    //html ドキュメント上の canvas のインスタンスが格納される
    var canvas;
    // 2d コンテキストのインスタンスが格納される
    var ctx;
 
    //雪だるまの image オブジェクトが格納される
    var img_snow_man;

    var requestId;

    //キーイベントの取得
    document.addEventListener("keydown", function () {
        if (event.keyCode == LEFT_KEY_CODE) {
            key_value = -3;
        } else if (event.keyCode == RIGHT_KEY_CODE) {
            key_value = 3;
        }
    });

    document.addEventListener("keyup", function () {
        key_value = 0;
    });

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

        
        for (var i = 0; i < 6; i++) {
            var sprite_snow = new Sprite('/img/snow.png');
            sprite_snow.dy = 1;
            sprite_snow.dx = 55;
            snow_sprites.push(sprite_snow);
            sprite_snow = null;
        }
        
        img_snow_man = new Sprite('/img/snow_man.png');
        
        loadCheck();
    };


    //Splite に画像がロードされたかどうかを判断
    function loadCheck() {

        if (!img_snow_man.imageLoaded) {
            requestId = window.requestAnimationFrame(loadCheck);
        };

        var length = snow_sprites.length;
        for (var i = 0; i < length; i++) {
            var snow_sprite = snow_sprites[i];
            if (!snow_sprite.imageLoaded) {
                requestId = window.requestAnimationFrame(loadCheck);
                return;
            }else{
                snow_sprite.y = getRandomPosition(6, -50);
                snow_sprite.x = i * snow_sprite.dx;
            }
        }

        var center_x = getCenterPostion(canvas.clientWidth, img_snow_man.width);
        img_snow_man.x = center_x;
        img_snow_man.y = 0;
        img_snow_man.y = canvas.clientHeight - img_snow_man.width;
        startScece();

    }


    function startScece() {
        //canvas をクリア
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        //img_snow_man の x 値を増分
        img_snow_man.x += key_value;

        var length = snow_sprites.length;
        for (var i = 0; i < length; i++) {
            var snow_sprite = snow_sprites[i];
            //img_snow の y 値(縦位置) が canvas からはみ出たら先頭に戻す
            if (snow_sprite.y > canvas.clientHeight) {
                //snow_sprite.y = 0
                snow_sprite.y = getRandomPosition(6, -50); 
            };

            //img_snow の y 値を増分
            snow_sprite.y += snow_sprite.dy;
            //画像を描画
            ctx.drawImage(snow_sprite.image, snow_sprite.x, snow_sprite.y);
            
            //当たり判定
            isHit(snow_sprite, img_snow_man);
            snow_sprite = null;
        }

        //画像を描画
        ctx.drawImage(img_snow_man.image, img_snow_man.x, img_snow_man.y);

        //ループを開始
        requestId = window.requestAnimationFrame(startScece);
       
    }

    //中央の Left 位置を求める関数
    function getCenterPostion(containerWidth, itemWidth) {
        return (containerWidth / 2) - (itemWidth / 2);
    };

    function getRandomPosition(colCount, delayPos) {
        return Math.floor(Math.random() * colCount) * delayPos;
    };

    //当たり判定
    function isHit(targetA, targetB) {
        if ((targetA.x <= targetB.x && targetA.width + targetA.x >= targetB.x)
                || (targetA.x >= targetB.x && targetB.x + targetB.width >= targetA.x)) {

            if ((targetA.y <= targetB.y && targetA.height + targetA.y >= targetB.y)
                || (targetA.y >= targetB.y && targetB.y + targetB.height >= targetA.y)) {
                ctx.font = "bold 50px";
                ctx.fillStyle = "red";
                ctx.fillText("ヒットしました", 100, 160);
            }
        }
    }

})();