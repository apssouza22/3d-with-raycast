let MOBILE = false;

document.addEventListener("DOMContentLoaded", function(event) {
    MOBILE = /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent)
    const canvas = document.getElementById('display');
    const canvas3D = new Canvas3D(canvas, MOBILE);
    const player = new Player(15.3, -1.2, Math.PI * 0.3);
    const map = new Map(32);
    const controls = new Controls();
    const itemDrawer = new Drawer(canvas3D, player, map);
    const camera = new Camera(canvas3D, map, itemDrawer);
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
class Canvas3D {
    constructor(canvas, isMobile) {
        this.ctx = canvas.getContext('2d');
        this.width = canvas.width = window.innerWidth * 0.5;
        this.height = canvas.height = window.innerHeight * 0.5;
        this.maxDistance = isMobile ? 8 : 14;
        this.resolution = isMobile ? 160 : 320;
        this.focalLength = 0.8;
    }
}
