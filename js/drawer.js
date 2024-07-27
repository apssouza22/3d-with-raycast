class Drawer {
    /** @type {Canvas3D} */
    canvas
    /** @type {Map} */
    map;
    /** @type {Player} */
    player;

    constructor(canvas, player, map) {
        this.canvas = canvas;
        this.player = player;
        this.map = map;
        this.ctx = canvas.ctx;
        this.lightRange = 5;
        this.spacing = canvas.width / canvas.resolution;
        this.scale = (canvas.width + canvas.height) / 1200;
        this.skybox = new Bitmap('img/panorama.jpg', 2000, 750);
        this.wallTexture = new Bitmap('img/wall.jpg', 1024, 1024);
        this.wallPaper = new Bitmap('img/wallpaper.png', 500, 730);
    }

    /**
     * Draw the columns on the screen.
     * @param {MapItem[]}objects
     */
    draw(objects) {
        this.drawSky();
        this.drawObjects(objects);
        this.drawWeapon(this.player.weapon, this.player.paces);
    }

    /**
     * Draw the slices on the screen.
     * @param {MapItem[]}columns3DProjected
     */
    drawObjects(columns3DProjected) {
        this.ctx.save();
        columns3DProjected.forEach(column => {
            this.drawItem(column);
        });
        this.ctx.restore();
    }

    drawWeapon(weapon, paces) {
        const bobX = Math.cos(paces * 2) * this.scale * 6;
        const bobY = Math.sin(paces * 4) * this.scale * 6;
        const left = this.canvas.width * 0.66 + bobX;
        const top = this.canvas.height * 0.6 + bobY;
        this.ctx.drawImage(weapon.image, left, top, weapon.width * this.scale, weapon.height * this.scale);
    }


    drawSky() {
        const direction = this.player.direction
        const ambient = this.map.light
        const width = this.skybox.width * (this.canvas.height / this.skybox.height) * 2;
        const left = (direction / CIRCLE) * -width;

        this.ctx.save();
        this.ctx.drawImage(this.skybox.image, left, 0, width, this.canvas.height);

        if (left < width - this.canvas.width) {
            this.ctx.drawImage(this.skybox.image, left + width, 0, width, this.canvas.height);
        }

        if (ambient > 0) {
            this.ctx.fillStyle = '#ffffff';
            this.ctx.globalAlpha = ambient * 0.1;
            this.ctx.fillRect(0, this.canvas.height * 0.5, this.canvas.width, this.canvas.height * 0.5);
        }

        this.ctx.restore();
    }


    /**
     * Draw the item on the screen.
     * @param {MapItem} object
     */
    drawItem(object) {
        const map = this.map;
        const step = object.step
        const texture = object.itemType === 1 ? this.wallTexture : this.wallPaper;
        const wall = object.position;
        const left = Math.floor(object.column * this.spacing);
        const width = Math.ceil(this.spacing);
        if (object.position) {
            const textureX = Math.floor(texture.width * step.offset);

            this.ctx.globalAlpha = 1;
            this.ctx.drawImage(texture.image, textureX, 0, 1, texture.height, left, wall.top, width, wall.height);

            this.ctx.fillStyle = '#000000';
            this.ctx.globalAlpha = Math.max((step.totalDistance + step.meta.shading) / this.lightRange - map.light, 0);
            this.ctx.fillRect(left, wall.top, width, wall.height);
        }

        this.ctx.fillStyle = '#ffffff';
        this.ctx.globalAlpha = 0.15;
    }

}