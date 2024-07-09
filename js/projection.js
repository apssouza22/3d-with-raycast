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

    #getColumn(column, raySteps, angle, map) {
        const texture = map.wallTexture;
        let hit = -1;
        while (++hit < raySteps.length && raySteps[hit].height <= 0) ;

        for (let s = raySteps.length - 1; s >= 0; s--) {
            if (s === hit) {
                const step = raySteps[s];
                const textureX = Math.floor(texture.width * step.offset);
                const item = this.#project3D(step.height, angle, step.totalDistance);
                return {
                    textureX: textureX,
                    item: item,
                    column: column,
                    texture: texture,
                    angle: angle,
                    step: step,
                }
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