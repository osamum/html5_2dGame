//Canvas への画像の読み込み

(function () {

    document.addEventListener("DOMContentLoaded", function () {
        loadAssets();
    });

    function loadAssets() {
        var canvas = document.getElementById('myCanvas');
        var ctx = canvas.getContext('2d');
        var img_snow = new Image();
        img_snow.src = '/img/snow.png';
        img_snow.onload = function () {
            ctx.drawImage(img_snow, 100, 0);

        };
    };


})();