const init = (gameObject) => {
    justAnotherWin.add(
        {
            x: 50,
            y: 50,
            width: 400,
            height: 400,
            name: "gameObjectConfigWindow",
        },
        document.createElement("my-tag"),
    );

    Slim.tag(
        "my-tag",
        `<div>{{name}}</div>`,
        class extends Slim {
            onBeforeCreated() {
                this.name = gameObject.name;
            }
        }
    );
    
}


export default init;
