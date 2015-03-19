(function () {

    //window.onload = function () { }
    var canvas = null,
        ctx = null,
        snow_img = null,
        snow_man_img = null,
        requestId = 0;

    //矢印キーのコード
    var LEFT_KEY_CODE = 37,
        RIGHT_KEY_CODE = 39,
        key_value = 0;

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
        startScene();
    });

    function loadAssets() {
        canvas = document.getElementById("playground");
        ctx = canvas.getContext('2d');

        snow_img = new Image();
        snow_img.src = '/img/snow.png';
        snow_img.onload = function () {
            snow_img.x = getCenterPostion(canvas.clientWidth, snow_img.width);
            snow_img.y = 0;
            ctx.drawImage(snow_img, snow_img.x, snow_img.y);
        };

        snow_man_img = new Image();
        snow_man_img.src = '/img/snow_man.png';
        snow_man_img.onload = function () {
            snow_man_img.x = getCenterPostion(canvas.clientWidth, snow_man_img.width);
            snow_man_img.y = canvas.clientHeight - snow_man_img.height;
            ctx.drawImage(snow_man_img, snow_man_img.x, snow_man_img.y);
        }
     
    }


    function startScene() {
        snow_img.y += 2;
        if (snow_img.y > canvas.clientHeight) snow_img.y = 0;
        ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
        ctx.drawImage(snow_img, snow_img.x, snow_img.y);

        snow_man_img.x += key_value;

        ctx.drawImage(snow_man_img, snow_man_img.x, snow_man_img.y);

        isHit(snow_img, snow_man_img);

        requestId = window.requestAnimationFrame(startScene);

    }

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

//中央の Left 位置を求める関数
function getCenterPostion(containerWidth, itemWidth) {
    return (containerWidth / 2) - (itemWidth / 2);
};

})();