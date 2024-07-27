class Drawer {

    constructor(canvas) {
        this.ctx = canvas.getContext('2d');
        this.lightRange = 5;
    }

    /**
     * Draw the columns on the screen.
     * @param {ProjectionSlice[]}columns3DProjected
     * @param {Map} map
     * @param spacing
     * @param ctx
     */
    draw(columns3DProjected, map, spacing, ctx) {
        this.ctx.save();
        columns3DProjected.forEach(column => {
            this.drawItem(column, map, spacing, ctx);
        });
        this.ctx.restore();
    }


    /**
     * Draw the item on the screen.
     * @param {ProjectionSlice} column
     * @param {Map} map
     * @param spacing
     * @param ctx
     */
    drawItem(column, map, spacing, ctx) {
        const angle = column.angle;
        const step = column.step
        const texture = column.texture;
        const wall = column.item;
        const left = Math.floor(column.column * spacing);
        const width = Math.ceil(spacing);
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