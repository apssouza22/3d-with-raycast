
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

    render() {
        this.clear();
        this.drawMap();
        this.drawPlayer();
    }

    clear() {
        this.context.clearRect(0, 0, this.width, this.height);
    }

    drawMap() {
        for (let y = 0; y < this.map.size; y++) {
            for (let x = 0; x < this.map.size; x++) {
                const hasWall = this.map.get(x, y);
                if (hasWall) {
                    this.context.fillStyle = '#fff';
                    this.context.fillRect(
                        x * this.spacing,
                        y * this.spacing,
                        this.spacing,
                        this.spacing
                    );
                }
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