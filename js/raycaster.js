/**
 * Raycaster is a class that is used to cast rays in a 2D map.
 */
class Raycaster {

    /**
     * Create a new Raycaster.
     * @param {Map} map
     * @param {number} maxDistance
     * @param {function} metaFn A function that returns the metadata for the ray step.
     */
    constructor(map, maxDistance, metaFn = (rayStep) => {}, miniMap) {
        this.map = map;
        this.miniMap = miniMap;
        /**
         * It is the maximum distance that a ray can travel.
         */
        this.maxDistance = maxDistance;
        this.metaFn = metaFn;
    }

    /**
     * Calculate the next step of the ray in the x or y direction.
     *
     * @param sinCos The sine or cosine of the angle.
     * @param cosSin The cosine or sine of the angle.
     * @param xY either x or y coordinate.
     * @param yX either y or x coordinate.
     * @param inverted
     * @returns {RayStep} The next step of the ray.
     */
    #step(sinCos, cosSin, xY, yX, inverted = false) {
        if (cosSin === 0)
            return new RayStep(Infinity, Infinity, Infinity);

        let dx = (cosSin > 0) ? Math.floor(xY + 1) - xY : Math.ceil(xY - 1) - xY;
        let dy = dx * (sinCos / cosSin);
        const info = {
            x: (inverted) ? yX + dy : xY + dx,
            y: (inverted) ? xY + dx : yX + dy,
            distance: dx * dx + dy * dy // squared distance
        };

        return new RayStep(info.x, info.y, info.distance)
    }

    /**
     * Inspect the step of the ray.
     *
     * @param {RayStep} step
     * @param shiftX
     * @param shiftY
     * @param distance
     * @param offset
     * @returns {RayStep}
     */
    #inspect(step, shiftX, shiftY, distance, offset) {
        let dx = (this.cos < 0) ? shiftX : 0;
        let dy = (this.sin < 0) ? shiftY : 0;
        step.offsetValue = this.map.get(step.x - dx, step.y - dy);
        step.height = step.offsetValue > 0 ? 1 : 0;
        step.totalDistance = distance + Math.sqrt(step.stepDistance);
        step.meta = this.metaFn(step, shiftX, shiftY, this.sin, this.cos);
        step.offset = offset - Math.floor(offset);
        return step;
    }

    /**
     * Cast the ray.
     * @returns {RayStep[]}
     */
    cast(point, angle) {
        this.sin = Math.sin(angle);
        this.cos = Math.cos(angle);
        let origin = new RayStep(point.x, point.y, 0);
        let steps = [origin];
        let nextStep = origin;

        while (true) {
            let stepX = this.#step(this.sin, this.cos, nextStep.x, nextStep.y);
            let stepY = this.#step(this.cos, this.sin, nextStep.y, nextStep.x, true);
            nextStep = (stepX.stepDistance < stepY.stepDistance) ?
                this.#inspect(stepX, 1, 0, nextStep.totalDistance, stepX.y) :
                this.#inspect(stepY, 0, 1, nextStep.totalDistance, stepY.x);

            if (nextStep.totalDistance > this.maxDistance)
                break;

            steps.push(nextStep);
        }
        return steps;
    }
}

/**
 * Represents a step of a ray.
 * A Ray step is a point in the map where the ray intersects a tile(map square).
 */
class RayStep {
    constructor(x, y, stepDistance) {
        this.x = x;
        this.y = y;
        /**
         * The squared length distance from the previous step.
         * @type {number}
         */
        this.stepDistance = stepDistance;

        /**
         * The height of the wall.
         */
        this.height = 0;
        /**
         * The distance from the player to the step.
         */
        this.totalDistance = 0;

        /**
         * The offset of the map. Map[offset].
         */
        this.offset = 0;

        /**
         * The offset value of the step. Map[offset] value.
         * @type {number}
         */
        this.offsetValue = 0;

        /**
         * The metadata of the step.
         * @type {{}}
         */
        this.meta = {};
    }
}