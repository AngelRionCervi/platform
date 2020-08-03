export function render(zoomed, camera, gameObjectBufferList, gridProps, helperGrid, entitySelection, containers) {
    camera.setCellsToInteract(gridProps.getTiles());
    const zoom = camera.getZoom();
    const camCoords = camera.getCoords();

    if (zoomed || !camera.still) { // so it doesnt trigger when we draw
        helperGrid.build();
    }
    
    entitySelection.create();

    containers.forEach((container) => {
        container.scale.set(zoom);
        container.position.set(camCoords.x, camCoords.y);
    })

    camera.setStill(true);
}