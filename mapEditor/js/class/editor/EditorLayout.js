class EditorLayout {
    constructor() {
        this.entities = {
            x: 0,
            y: window.innerHeight - 200,
            width: window.innerWidth,
            height: 200,
        }
        this.palette = {
            x: 0,
            y: 0,
            width: 270,
            height: window.innerHeight - this.entities.height,
        }
        this.tools = {
            x: window.innerWidth - 200,
            y: 0,
            width: 200,
            height: window.innerHeight - this.entities.height,
        }
        this.editor = {
            x: this.palette.width,
            y: 0,
            width: window.innerWidth - this.palette.width - this.tools.width,
            height: window.innerHeight - this.entities.height,
        }
    }
}

export default new EditorLayout();
