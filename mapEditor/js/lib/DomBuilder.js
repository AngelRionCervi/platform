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

}