export class DomBuilder {
    element = null;

    createNode(tag, _class = null, id = null, inner = null, listener = null, customAttr = null, inlineStyle = null) {
        this.element = document.createElement(tag);

        if (_class) {
            this.addClasses(_class);
        }

        if (id) {
            this.element.id = id;
        }

        if (inner) {
            inner = [inner].flat();
            inner.forEach((content) => {
                switch (typeof content) {
                    case "string":
                        this.element.innerText = content;
                        break;
                    case "number":
                        this.element.innerText = content.toString();
                        break;
                    case "object":
                        this.element.appendChild(content);
                        break;
                }
            });
        }

        if (listener) {
            if (Array.isArray(listener)) {
                listener.forEach((l) => {
                    this.createListener(l);
                });
            } else {
                this.createListener(listener);
            }
        }

        if (inlineStyle) {
            this.addInlineStyle(customAttr);
        }

        if (customAttr) {
            this.addCustomAttr(customAttr);
        }

        return this;
    }

    addClasses(_class, node = null) {
        _class = [_class].flat();
        _class.forEach((c) => {
            const el = node ? node : this.element;
            el.classList.add(...c.split(" "));
        });
        return this;
    }

    addInlineStyle(styles, node = null) {
        Object.keys(styles).forEach((key) => {
            const el = node ? node : this.element;
            el.style[key] = styles[key];
        });
        return this;
    }

    addCustomAttr(customAttr, node = null) {
        customAttr = [customAttr].flat();
        customAttr.forEach((attr) => {
            const el = node ? node : this.element;
            el.setAttribute(attr.type, attr.val);
        });
        return this;
    }

    createListener(l, node = null) {
        if (!l.hasOwnProperty("args")) l.args = [];
        const el = node ? node : this.element;
        el.addEventListener(l.type, (e) => {
            e.preventDefault();
            if (l.hasOwnProperty("event") && !l.event) {
                l.callback(...l.args);
            } else {
                l.callback(e, ...l.args);
            }
            return false;
        });
        return this;
    }

    done() {
        return this.element;
    }

    enclose(nodes, _class = null, tag = "div", listener = null, customAttrIn = null) {
        this.element = document.createElement(tag);

        for (const node of nodes) this.element.appendChild(node);
        if (customAttrIn) {
            nodes.forEach((node) => {
                this.addCustomAttr(customAttrIn, node);
            });
        }
        if (_class) this.addClasses(_class);
        if (listener) {
            const listeners = [listener].flat();
            listeners.forEach((l) => {
                this.createListener(l);
            });
        }

        return this;
    }
}
/*
export class DomBuilder {

    createNode(type, _class = null, id = null, inner = null, listener = null) {

        let el = document.createElement(type);
    
        if (_class) {
            _class = [_class].flat(); 
            _class.forEach((c) => {
                el.classList.add(...c.split(' '));
            })
        }

        if (id) {
            el.id = id;
        }
    
        if (inner) {
            switch (typeof inner) {
                case 'string':
                    el.innerText = inner;
                    break;
                case 'number':
                    el.innerText = inner.toString();
                    break;
                case 'object': 
                    if (Array.isArray(inner)) {
                        inner.map(e => el.appendChild(e));
                    } else {
                        el.appendChild(inner);
                    }
                    break;
            }
        } 
    
        if (listener) {
            if (Array.isArray(listener)) {
                listener.forEach((l) => {
                    this.createListener(el, l);
                })
            } else {
                this.createListener(el, listener);
            }
        }
    
        return el;
    }

    createListener(el, l) {
        el.addEventListener(l.type, (e) => {
            e.preventDefault();
            if (l.hasOwnProperty('event') && !l.event) {
                l.callback(...l.args);
            }
            else {
                l.callback(e, ...l.args);
            }
            return false;
        })
    }

}*/