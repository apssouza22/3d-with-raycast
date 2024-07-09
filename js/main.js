var MOBILE = false;
document.addEventListener("DOMContentLoaded", function(event) {
    MOBILE = /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent)
    var canvas = document.getElementById('display');
    var player = new Player(15.3, -1.2, Math.PI * 0.3);
    var map = new Map(32);
    var controls = new Controls();
    var camera = new Camera(canvas, MOBILE ? 160 : 320, 0.8, map);
    var loop = new GameLoop();

    map.randomize();

    loop.start(function frame(seconds) {
        map.update(seconds);
        player.update(controls.states, map, seconds);
        camera.render(player, map);
    });
});