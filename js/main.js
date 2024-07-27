let MOBILE = false;

document.addEventListener("DOMContentLoaded", function(event) {
    MOBILE = /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent)
    const canvas = document.getElementById('display');
    const canvas3D = new Canvas3D(canvas, MOBILE);
    const player = new Player(15.3, 1.2, Math.PI * 0.3);
    const map = new Map(32);
    const itemDrawer = new Drawer(canvas3D, player, map);
    const miniMap = new MiniMap(map, player);
    const raycast = new Raycaster(map, canvas3D.maxDistance, shadingProcessor);
    const camera = new Camera(canvas3D.resolution, canvas3D.focalLength, raycast);
    const render3D = new Render3D(canvas3D, itemDrawer, miniMap, camera);
    const loop = new GameLoop();
    const controls = new Controls();

    map.randomize();

    loop.start(seconds => {
        map.update(seconds);
        player.update(controls.states, map, seconds);
        render3D.render(player, map);
    });
});
class Canvas3D {
    constructor(canvas, isMobile) {
        this.ctx = canvas.getContext('2d');
        this.width = canvas.width = window.innerWidth * 0.5;
        this.height = canvas.height = window.innerHeight * 0.5;
        this.maxDistance = isMobile ? 8 : 14;
        //resolution refers to the number of vertical slices (or columns) that the screen is divided into for the purpose of rendering the 3D scene
        this.resolution = isMobile ? 160 : 320;
        // focalLength is the distance from the player to the projection plane (a measure of how "zoomed in" the view is).
        this.focalLength = 0.8;
    }
}
