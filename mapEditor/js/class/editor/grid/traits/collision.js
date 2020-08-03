export default (collisionBox) => ({
    setCollisionBox(curPos) {
        const cell = this.getCellByCursor(curPos);

        if (!cell.isCollisionEnabled()) {
            const floorCoord = this.floorMouse(curPos);
            const box = collisionBox.addBox(floorCoord, cell);
            if (box) {
                cell.enableCollision();
                collisionBox.render(box);
            }
        }
    }
})