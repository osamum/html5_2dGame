﻿(function () {
    /* ゲーム内で共通で使用する変数 */

    //Sprite を格納する配列
    var snow_sprites = [];

    //雪が砕けた際のサウンドを格納
    var sound_snow_crash = null;

    //矢印キーのコード
    var LEFT_KEY_CODE = 37;
    var RIGHT_KEY_CODE = 39;
    var key_value = 0;

    //雪の画像サイズ
    var SNOW_PIC_SIZE = 32;

    //雪の降るスピード
    var SNOW_DOWS_SPEED = 3;

    //表示する雪の数
    var DRAW_SNOW_COUNT = 6;
    var DRAW_SNOW_GAP = 55;

    //雪ダルマの画像サイズ
    var SNOW_MAN_PIC_SIZE = 80;

    //html ドキュメント上の canvas のインスタンスが格納される
    var canvas;
    // 2d コンテキストのインスタンスが格納される
    var ctx;

    //雪ダルマの image オブジェクトが格納される
    var img_snow_man;

    //雪ダルマの移動量
    var PLAYER_MOVE_SPEED_R = 5;
    var PLAYER_MOVE_SPEED_L = -5;

    //画面の書き換え数をカウントする
    var loopCounter = 0;

    var requestId;

    //前回動いた時間を格納
    var bofore_animation_time = 0;
    
    //ゲーム内で動作する Sprite クラス
    var Sprite = function (imgSrc, width, height) {
        var that = this;
        that.imageLoaded = false;
        that.imageSource = imgSrc;
        that.x = 0;
        that.y = 0;
        that.dx = 0;
        that.dy = 0;
        that.width = width;
        that.height = height;
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
            that.image = img;
        };

        this.sound = new Audio("/sound/kiiiin1.mp3");
        this.sound.onload = function () {
            this.soundLoaded = true;
        }

        //Sprite を描画すめメソッド
        that.draw = function () {
            ctx.drawImage(img, _offset_x_pos, 0, width, height, that.x, that.y, width, height);
        };
    };

    //Document の準備ができたら
    document.addEventListener("DOMContentLoaded", function () {
        loadAssets();
        setHandlers();
    });

    function setHandlers() {
        //キーイベントの取得 (キーダウン)
        document.addEventListener("keydown", function (evnt) {
            if (evnt.which == LEFT_KEY_CODE) {
                key_value = PLAYER_MOVE_SPEED_L;
            } else if (evnt.which == RIGHT_KEY_CODE) {
                key_value = PLAYER_MOVE_SPEED_R;
            }
        });
        
        //キーイベントの取得 (キーアップ)
        document.addEventListener("keyup", function () {
            key_value = 0;
        });

        //タッチした際の右クリックメニューの抑制
        document.oncontextmenu = function () { return false; }

        //Canvas へのタッチイベント設定
        canvas.addEventListener("touchstart", function (evnt) {
            if ((screen.width / 2) > evnt.touches[0].clientX) {
                key_value = PLAYER_MOVE_SPEED_L;
            } else {
                key_value = PLAYER_MOVE_SPEED_R;
            }
        });

        canvas.addEventListener("touchend", function (evnt) {
            key_value = 0;
        });

    }


    //canvas 内に使用する画像をロード
    function loadAssets() {
        //HTML エレメント上の canvas のインスタンスを取得
        canvas = document.getElementById('myCanvas');
        //2d コンテキストを取得
        ctx = canvas.getContext('2d');
        
        for (var i = 0; i < DRAW_SNOW_COUNT; i++) {
            //雪のインスタンスを生成
            var sprite_snow = new Sprite('/img/snowSP.png', SNOW_PIC_SIZE, SNOW_PIC_SIZE);
            sprite_snow.dy = 3;
            sprite_snow.dx = DRAW_SNOW_GAP;
            snow_sprites.push(sprite_snow);
            sprite_snow = null;
        }
        //雪だるまのインスタンスを生成
        img_snow_man = new Sprite('/img/snow_man.png', SNOW_MAN_PIC_SIZE, SNOW_MAN_PIC_SIZE);

        img_snow_man.limit_rightPosition = getRightLimitPosition(canvas.clientWidth, img_snow_man.width);

        //画像のロードが完了したかどうかをチェックする関数
        loadCheck();
    };


    //Splite に画像がロードされたかどうかを判断
    function loadCheck() {
        if (!img_snow_man.imageLoaded ) {
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

    
    //fps のコントロールコード
    function control_fps(fps) {
        var renderFlag = ! (((window.performance.now() - bofore_animation_time) < (600 / fps)) && bofore_animation_time);
        if (renderFlag) bofore_animation_time = window.performance.now();
        return renderFlag;
    }
   
   
    function startScece() {
        if(control_fps(48) ) {
            //canvas をクリア
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            if ((img_snow_man.x < img_snow_man.limit_rightPosition && key_value > 0)
                || (img_snow_man.x >= 3 && key_value < 0)) {
                //img_snow_man の x 値を増分
                img_snow_man.x += key_value;
            }

            var length = snow_sprites.length;
            for (var i = 0; i < length; i++) {
                var snow_sprite = snow_sprites[i];
                //img_snow の y 値(縦位置) が canvas からはみ出たら先頭に戻す
                if (snow_sprite.y > canvas.clientHeight) {
                    snow_sprite.y = getRandomPosition(DRAW_SNOW_COUNT, -50);
                    snow_sprite.index = 0;
                    snow_sprite.soundPlayed = false;
                } else {
                    if (loopCounter == 30 && snow_sprite.index != 2) {
                        snow_sprite.index = (snow_sprite.index == 0) ? 1 : 0;
                    }
                }

                //img_snow の y 値を増分
                snow_sprite.y += snow_sprite.dy;
                //画像を描画
                snow_sprite.draw();

                //当たり判定
                if (isHit(snow_sprite, img_snow_man)) {
                    hitJob(snow_sprite);
                };
                snow_sprite = null;
            }

            //画像を描画
            img_snow_man.draw();

            if (loopCounter == 30) { loopCounter = 0; }

            loopCounter++;

            //ループを開始
            requestId = window.requestAnimationFrame(startScece);
        } else {
            requestId = window.requestAnimationFrame(startScece);
        }
    }

    //中央の Left 位置を求める関数
    function getCenterPostion(containerWidth, itemWidth) {
        return (containerWidth / 2) - (itemWidth / 2);
    };

    //Player (雪だるまを動かせる右の限界位置)
    function getRightLimitPosition(containerWidth, itemWidth) {
        return containerWidth - itemWidth;
    }

    function getRandomPosition(colCount, delayPos) {
        return Math.floor(Math.random() * colCount) * delayPos;
    };

    //雪と雪だるまがヒットした際の処理
    function hitJob(snow_sprite) {
        ctx.font = "bold 50px";
        ctx.fillStyle = "red";
        ctx.fillText("ヒットしました", 100, 160);
        snow_sprite.index = 2;
        if (!snow_sprite.soundPlayed) {
            snow_sprite.sound.play();
            snow_sprite.soundPlayed = true;
        }
    }


    //当たり判定
    function isHit(targetA, targetB) {
        if ((targetA.x <= targetB.x && targetA.width + targetA.x >= targetB.x)
                || (targetA.x >= targetB.x && targetB.x + targetB.width >= targetA.x)) {

            if ((targetA.y <= targetB.y && targetA.height + targetA.y >= targetB.y)
                || (targetA.y >= targetB.y && targetB.y + targetB.height >= targetA.y)) {
                return true;
            }
        }
    }

})();