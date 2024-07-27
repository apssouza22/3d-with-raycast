class ProjectionSlice{
    constructor(textureX, item, column, texture, angle, step) {
        this.textureX = textureX;
        this.item = item;
        this.column = column;
        this.texture = texture;
        this.angle = angle;
        this.step = step;
    }
}
class ColumnProjection {
    resolution;
    focalLength;
    map;
    raycast;

    constructor(resolution, focalLength, map, raycast) {
        this.resolution = resolution;
        this.focalLength = focalLength;
        this.map = map;
        this.raycast = raycast;
        this.height = window.innerHeight * 0.5;
    }

    /**
     * Get the columns of the projection. The columns are the vertical slices of the screen.
     *
     * @param {Player}player
     * @param {Map}map
     * @returns {ProjectionSlice[]}
     */
    getColumns(player, map) {
        const columns = [];
        for (let column = 0; column < this.resolution; column++) {
            const x = column / this.resolution - 0.5;
            const angle = Math.atan2(x, this.focalLength);
            const raySteps = this.raycast.cast(player, player.direction + angle);
            let columnItem = this.#getColumn(column, raySteps, angle, map);
            columns.push(columnItem);
        }
        return columns;
    }

    /**
     * Get the column. The column is a vertical slice of the screen.
     * @param {int} column
     * @param {RayStep[]} raySteps
     * @param {int} angle
     * @param {Map} map
     * @returns {ProjectionSlice}
     */
    #getColumn(column, raySteps, angle, map) {
        const texture = map.wallTexture;
        let hit = -1;
        while (++hit < raySteps.length && raySteps[hit].height <= 0) ;

        for (let s = raySteps.length - 1; s >= 0; s--) {
            if (s === hit) {
                const step = raySteps[s];
                const textureX = Math.floor(texture.width * step.offset);
                const item = this.#project3D(step.height, angle, step.totalDistance);
                return new ProjectionSlice(textureX, item, column, texture, angle, step);
            }
        }
        return {
            column: column,
        };
    }

    #project3D(height, angle, distance) {
        const z = distance * Math.cos(angle);
        const wallHeight = this.height * height / z;
        const bottom = this.height / 2 * (1 + 1 / z);

        return {
            top: bottom - wallHeight,
            height: wallHeight
        };
    }

}