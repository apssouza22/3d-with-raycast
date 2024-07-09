class Camera {
    constructor(canvas, resolution, focalLength, map) {
        this.ctx = canvas.getContext('2d');
        this.width = canvas.width = window.innerWidth * 0.5;
        this.height = canvas.height = window.innerHeight * 0.5;
        this.resolution = resolution;
        this.spacing = this.width / resolution;
        this.focalLength = focalLength || 0.8;
        this.maxDistance = MOBILE ? 8 : 14;
        this.lightRange = 5;
        this.scale = (this.width + this.height) / 1200;
        this.raycast = new Raycaster(map, this.maxDistance, shadingProcessor);
        this.projection = new ColumnProjection(this.resolution, this.focalLength, map, this.raycast);
    }

    render(player, map) {
        this.drawSky(player.direction, map.skybox, map.light);
        this.drawColumns(player, map);
        this.drawWeapon(player.weapon, player.paces);
    }

    drawSky(direction, sky, ambient) {
        const width = sky.width * (this.height / sky.height) * 2;
        const left = (direction / CIRCLE) * -width;

        this.ctx.save();
        this.ctx.drawImage(sky.image, left, 0, width, this.height);

        if (left < width - this.width) {
            this.ctx.drawImage(sky.image, left + width, 0, width, this.height);
        }

        if (ambient > 0) {
            this.ctx.fillStyle = '#ffffff';
            this.ctx.globalAlpha = ambient * 0.1;
            this.ctx.fillRect(0, this.height * 0.5, this.width, this.height * 0.5);
        }

        this.ctx.restore();
    }

    drawColumns(player, map) {
        this.ctx.save();

        let columns  = this.projection.getColumns(player, map);
        columns.forEach(column => {
            this.drawItem(column, column.angle, map);
        });
        this.ctx.restore();
    }

    drawWeapon(weapon, paces) {
        const bobX = Math.cos(paces * 2) * this.scale * 6;
        const bobY = Math.sin(paces * 4) * this.scale * 6;
        const left = this.width * 0.66 + bobX;
        const top = this.height * 0.6 + bobY;
        this.ctx.drawImage(weapon.image, left, top, weapon.width * this.scale, weapon.height * this.scale);
    }

    drawItem(column, angle, map) {
        const step = column.step
        const texture = column.texture;
        const wall = column.item;
        const ctx = this.ctx;
        const left = Math.floor(column.column * this.spacing);
        const width = Math.ceil(this.spacing);
        if (column.item) {
            const textureX = Math.floor(texture.width * step.offset);

            ctx.globalAlpha = 1;
            ctx.drawImage(texture.image, textureX, 0, 1, texture.height, left, wall.top, width, wall.height);

            ctx.fillStyle = '#000000';
            ctx.globalAlpha = Math.max((step.totalDistance + step.meta.shading) / this.lightRange - map.light, 0);
            ctx.fillRect(left, wall.top, width, wall.height);
        }

        ctx.fillStyle = '#ffffff';
        ctx.globalAlpha = 0.15;
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