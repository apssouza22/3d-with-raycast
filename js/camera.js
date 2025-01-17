class MapItem {
    constructor(position, column, step, angle) {
        this.position = position;
        this.column = column;
        this.step = step;
        this.angle = angle;
        this.itemType = step.offsetValue
    }
}

class Camera {
    resolution;
    focalLength;
    raycast;

    constructor(resolution, focalLength, raycast) {
        this.resolution = resolution;
        this.focalLength = focalLength;
        this.raycast = raycast;
        this.height = window.innerHeight * 0.5;
    }

    /**
     * Get the object within in the camera view
     *
     * @param {{x, y}}point
     * @param {number}angleView
     * @returns {MapItem[]}
     */
    getObjects(point, angleView) {
        const objects = [];
        for (let column = 0; column < this.resolution; column++) {
            const x = column / this.resolution - 0.5;
            const angle = Math.atan2(x, this.focalLength);
            const raySteps = this.raycast.cast(point, angleView + angle);
            let objectItem = this.#getObject(column, raySteps, angle);
            if (objectItem) {
                objects.push(objectItem);
            }
        }
        return objects;
    }

    /**
     * Get the object within the camera view found by the ray
     * @param {int} column
     * @param {RayStep[]} raySteps
     * @param {int} angle
     * @returns {MapItem}
     */
    #getObject(column, raySteps, angle) {
        let hit = -1;
        while (++hit < raySteps.length && raySteps[hit].height <= 0) ;

        for (let s = raySteps.length - 1; s >= 0; s--) {
            if (s !== hit) {
                continue;
            }
            const step = raySteps[s];
            return new MapItem({}, column, step, angle);
        }
    }


    project3D(height, angle, distance) {
        const z = distance * Math.cos(angle);
        const wallHeight = this.height * height / z;
        const bottom = this.height / 2 * (1 + 1 / z);

        return {
            top: bottom - wallHeight,
            height: wallHeight
        };
    }


}