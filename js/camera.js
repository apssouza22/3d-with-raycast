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
     * @param miniMap
     */
    constructor(canvas,  map, itemDrawer, miniMap) {
        this.miniMap = miniMap;
        this.itemDrawer = itemDrawer;
        this.raycast = new Raycaster(map, canvas.maxDistance, shadingProcessor, miniMap);
        this.projection = new ViewProjection(canvas.resolution, canvas.focalLength, map, this.raycast);
    }

    /**
     * Render the player, map, and weapon.
     * @param {Player}player
     * @param {Map}map
     */
    render(player, map) {
        let columns3DProjected = this.projection.getObjects(player, player.direction);
        this.miniMap.render(columns3DProjected);
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