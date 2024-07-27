class Camera {
    /**
     * @type {Drawer}
     */
    itemDrawer

    /**
     * Create a new camera.
     * @param {Canvas3D} canvas
     * @param {Map} map
     * @param {Drawer} itemDrawer
     */
    constructor(canvas,  map, itemDrawer) {
        this.itemDrawer = itemDrawer;
        this.raycast = new Raycaster(map, canvas.maxDistance, shadingProcessor);
        this.projection = new ViewProjection(canvas.resolution, canvas.focalLength, map, this.raycast);
    }

    /**
     * Render the player, map, and weapon.
     * @param {Player}player
     * @param {Map}map
     */
    render(player, map) {
        this.drawColumns(player, map);
    }

    drawColumns(player, map) {
        let columns3DProjected = this.projection.getObjects(player, player.direction);
        this.itemDrawer.draw(columns3DProjected);
    }

}

/**
 * Shading is used to determine the shading of the wall.
 */
function shadingProcessor(step, shiftX, cos, sin) {
    let shading = 0
    if (shiftX)
        shading = (cos < 0) ? 2 : 0;
    else
        shading = (sin < 0) ? 2 : 1;

    return {
        shading: shading,
    }
}