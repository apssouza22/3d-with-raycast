class ObjectLoader {

    /**
     *
     * @param {Raycaster}rayCaster
     */
    constructor(rayCaster) {
        this.rayCaster = rayCaster;
        this.objects = [];
    }

    loadObjectFromMap(cast) {
        this.rayCaster.cast()
        this.objects.push(object);
    }


}