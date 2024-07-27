class Render3D {
    /**
     * @type {Drawer}
     */
    itemDrawer

    /**
     * Create a new camera.
     * @param {Canvas3D} canvas
     * @param {Drawer} itemDrawer
     * @param miniMap
     * @param {Camera} camera
     */
    constructor(canvas, itemDrawer, miniMap, camera) {
        this.miniMap = miniMap;
        this.itemDrawer = itemDrawer;
        this.camera = camera
    }

    /**
     * Render the player, map, and weapon.
     * @param {Player}player
     * @param {Map}map
     */
    render(player, map) {
        let objects = this.camera.getObjects(player, player.direction);
        objects.forEach(objectItem => {
            objectItem.position = this.camera.project3D(objectItem.step.height, objectItem.angle, objectItem.step.totalDistance);
        });
        this.miniMap.render(objects);
        this.itemDrawer.draw(objects);
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