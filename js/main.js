let MOBILE = false;

document.addEventListener("DOMContentLoaded", function(event) {
    MOBILE = /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent)
    const canvas = document.getElementById('display');
    const player = new Player(15.3, -1.2, Math.PI * 0.3);
    const map = new Map(32);
    const controls = new Controls();
    const itemDrawer = new Drawer(canvas);
    const camera = new Camera(canvas, MOBILE ? 160 : 320, 0.8, map, itemDrawer);
    const loop = new GameLoop();
    const miniMap = new MiniMap(map, player);

    map.randomize();

    loop.start(seconds => {
        map.update(seconds);
        player.update(controls.states, map, seconds);
        camera.render(player, map);
        miniMap.render();
    });

});