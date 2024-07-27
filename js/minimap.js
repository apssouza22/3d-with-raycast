
class MiniMap {

    /**
     * @param {Map} map
     * @param {Player} player
     */
    constructor(map, player) {
        this.map = map;
        this.player = player;
        this.width = 200;
        this.height = 200;
        this.spacing = Math.floor(this.width / this.map.size);
        this.canvas = document.getElementById('minimap');
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.context = this.canvas.getContext('2d');
        document.body.appendChild(this.canvas);
    }

    render(mapObjects) {
        this.clear();
        this.drawMap();
        this.drawPlayer();
        this.drawRays(mapObjects);
    }


    drawRays(raySteps) {
        this.context.strokeStyle = 'red';
        this.context.lineWidth = 1;

        raySteps.forEach(item => {
            const step = item.step;
            this.context.beginPath();
            this.context.moveTo(
                this.player.x * this.spacing,
                this.player.y * this.spacing
            );
            this.context.lineTo(
                step.x * this.spacing,
                step.y * this.spacing
            );
            this.context.stroke();
        });
    }

    clear() {
        this.context.clearRect(0, 0, this.width, this.height);
    }

    drawMap() {
        for (let y = 0; y < this.map.size; y++) {
            for (let x = 0; x < this.map.size; x++) {
                const hasObj = this.map.get(x, y);
                if (!hasObj) {
                    continue;
                }
                if (hasObj === 1) {
                    this.context.fillStyle = '#fff';
                } else {
                    this.context.fillStyle = 'yellow';
                }
                    this.context.fillRect(
                        x * this.spacing,
                        y * this.spacing,
                        this.spacing,
                        this.spacing
                    );
            }
        }
    }

    drawPlayer() {
        this.context.fillStyle = 'green';
        this.context.fillRect(
            this.player.x * this.spacing - 2,
            this.player.y * this.spacing - 2,
            5, 5
        );
        this.context.lineWidth = 2;
        this.context.strokeStyle = 'green';
        this.context.beginPath();
        this.context.moveTo(this.player.x * this.spacing, this.player.y * this.spacing);
        this.context.lineTo(
            (this.player.x + Math.cos(this.player.direction) * 4) * this.spacing,
            (this.player.y + Math.sin(this.player.direction) * 4) * this.spacing
        );
        this.context.closePath();
        this.context.stroke();
    }
}