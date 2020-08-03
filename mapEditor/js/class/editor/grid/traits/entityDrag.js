export default (gameObjectBufferList, camera) => ({
    isDragging() {
        return this.dragging;
    },

    startDragging(coord, selectedIDs) {
        this.dragging = true;
        this.startDragCoord = coord;
        const gameObjects = gameObjectBufferList.getObjectsBuffer(selectedIDs);
        this.objDragOrigins = JSON.parse(JSON.stringify(gameObjects.map((el) => el.coord)));
    },

    stopDragging() {
        if (!this.dragging) return;
        this.dragging = false;
        this.startDragCoord = null;
        this.objDragOrigins = null;
    },

    drag(cursorPos, selectedIDs) {
        if (!this.dragging || !this.objDragOrigins || !this.startDragCoord) return;
        const gameObjects = gameObjectBufferList.getObjectsBuffer(selectedIDs);
        const tw = camera.toWorld.bind(camera);

        gameObjects.forEach((go, index) => {
            const nX = this.objDragOrigins[index].x - tw(this.startDragCoord.x) + tw(cursorPos.x);
            const nY = this.objDragOrigins[index].y - tw(this.startDragCoord.y) + tw(cursorPos.y);
            go.coord.x = nX;
            go.coord.y = nY;
        });
    }
})