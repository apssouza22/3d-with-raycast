class Map {
    constructor(size) {
        this.size = size;
        // wallGrid is a flattened version of the 2D grid
        this.wallGrid = new Uint8Array(size * size);
        this.wallTexture = new Bitmap('img/wall.jpg', 1024, 1024);
        this.light = 0;
    }

    get(x, y) {
        x = Math.floor(x);
        y = Math.floor(y);

        if (x < 0 || x > this.size - 1 || y < 0 || y > this.size - 1)
            return -1;

        return this.wallGrid[y * this.size + x];
    }

    randomize() {
        for (let i = 0; i < this.size * this.size; i++) {
            if(Math.random() > 0.3){
                this.wallGrid[i] = 0;
                continue;
            }
            this.wallGrid[i] = Math.random() < 0.8 ? 1 : 2;
        }
    }

    update(seconds) {
        if (this.light > 0) {
            this.light = Math.max(this.light - 10 * seconds, 0);
            return
        }
        if (Math.random() * 5 < seconds)
            this.light = 2;
    }
}