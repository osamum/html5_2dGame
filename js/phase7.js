(function () {
    /* ゲーム内で共通で使用する変数 */

    //Sprite を格納する配列
    var snow_sprites = [];

    //矢印キーのコード
    var LEFT_KEY_CODE = 37;
    var RIGHT_KEY_CODE = 39;
    var key_value = 0;

    //雪の画像サイズ
    var SNOW_PIC_SIZE = 32;

    //雪ダルマの画像サイズ
    var SNOW_MAN_PIC_SIZE = 80;

    //表示する雪の数
    var DRAW_SNOW_COUNT = 6;
    var DRAW_SNOW_GAP = 55;

    //html ドキュメント上の canvas のインスタンスが格納される
    var canvas;
    // 2d コンテキストのインスタンスが格納される
    var ctx;

    //雪だるまの image オブジェクトが格納される
    var img_snow_man;

    //画面の書き換え数をカウントする
    var loopCounter = 0;

    var requestId;

    
    //ゲーム内で動作する Sprite クラス
    var Sprite = function (imgSrc, width, height) {
        var that = this;
        that.imageLoaded = false;
        that.imageSource = imgSrc;
        that.x = 0;
        that.y = 0;
        that.dx = 0;
        that.dy = 0;

        var _offset_x_pos = 0;
        
        //使用するインデックスを設定するための Setter/Getter
        var imageIndex = 0;;
        Object.defineProperty(this, "index", {
            get: function () {
                return imageIndex;
            },
            set: function (val) {
                imageIndex = val;
                _offset_x_pos = width * imageIndex;
            }
        });

        //新しい image オブジェクトのインスタンスを生成
        var img = new Image();
        //image オブジェクトに画像をロード
        img.src = imgSrc;
        //画像がロードされたら
        img.onload = function () {
            that.imageLoaded = true;
            that.width = width;
            that.height = height;
            that.image = img;
        };

        //Sprite を描画すめメソッド
        that.draw = function () {
            ctx.drawImage(img, _offset_x_pos, 0, width, height, that.x, that.y, width, height);
        };
    };



    //キーイベントの取得 (キーダウン)
    document.addEventListener("keydown", function () {
        if (event.keyCode == LEFT_KEY_CODE) {
            key_value = -3;
        } else if (event.keyCode == RIGHT_KEY_CODE) {
            key_value = 3;
        }
    });

    //キーイベントの取得 (キーアップ)
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
        
        for (var i = 0; i < DRAW_SNOW_COUNT; i++) {
            //雪のインスタンスを生成
            var sprite_snow = new Sprite('/img/snowSP.png', SNOW_PIC_SIZE, SNOW_PIC_SIZE);
            sprite_snow.dy = 1;
            sprite_snow.dx = DRAW_SNOW_GAP;
            snow_sprites.push(sprite_snow);
            sprite_snow = null;
        }
        //雪だるまのインスタンスを生成
        img_snow_man = new Sprite('/img/snow_man.png', SNOW_MAN_PIC_SIZE, SNOW_MAN_PIC_SIZE);

        //画像のロードが完了したかどうかをチェックする関数
        loadCheck();
    };


    //Splite に画像がロードされたかどうかを判断
    function loadCheck() {

        if (!img_snow_man.imageLoaded) {
            //雪だるまの画像のロードが完了していなければループして待つ
            requestId = window.requestAnimationFrame(loadCheck);
        };

        var length = snow_sprites.length;
        for (var i = 0; i < length; i++) {
            var snow_sprite = snow_sprites[i];
            if (!snow_sprite.imageLoaded) {
                requestId = window.requestAnimationFrame(loadCheck);
                return;
            }else{
                snow_sprite.y = getRandomPosition(DRAW_SNOW_COUNT, -50);
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
                snow_sprite.y = getRandomPosition(DRAW_SNOW_COUNT, -50);
                snow_sprite.index = 0;
            } else {
                if (loopCounter == 30 && snow_sprite.index !=2 ) {
                    snow_sprite.index = (snow_sprite.index == 0) ? 1 : 0;
                }
            }

            //img_snow の y 値を増分
            snow_sprite.y += snow_sprite.dy;
            //画像を描画
            snow_sprite.draw();
            
            //当たり判定
            isHit(snow_sprite, img_snow_man);
            snow_sprite = null;
        }

        //画像を描画
        img_snow_man.draw();

        if (loopCounter == 30) { loopCounter = 0; }

        loopCounter++;

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
                targetA.index = 2;
            }
        }
    }

})();