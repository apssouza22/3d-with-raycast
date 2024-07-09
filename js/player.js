const CIRCLE = Math.PI * 2;

class Bitmap {
    constructor(src, width, height) {
        this.image = new Image();
        this.image.src = src;
        this.width = width;
        this.height = height;
    }
}

class Player {
    constructor(x, y, direction) {
        this.x = x;
        this.y = y;
        this.direction = direction;
        this.weapon = new Bitmap('img/hand.png', 319, 320);
        this.paces = 0;
    }

    rotate(angle) {
        this.direction = (this.direction + angle + CIRCLE) % CIRCLE;
    }

    walk(distance, map) {
        const dx = Math.cos(this.direction) * distance;
        const dy = Math.sin(this.direction) * distance;

        if (map.get(this.x + dx, this.y) <= 0)
            this.x += dx;

        if (map.get(this.x, this.y + dy) <= 0)
            this.y += dy;

        this.paces += distance;
    }

    update(controls, map, seconds) {
        if (controls.left)
            this.rotate(-Math.PI * seconds);

        if (controls.right)
            this.rotate(Math.PI * seconds);

        if (controls.forward)
            this.walk(3 * seconds, map);

        if (controls.backward)
            this.walk(-3 * seconds, map);
    }
}