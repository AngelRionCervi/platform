export class DomBuilder {


    createNode(type, _class = null, id = null, inner = null, listener = null) {

        let el = document.createElement(type);
    
        if (_class) {
            _class = [_class].flat(); 
            el.classList.add(..._class);
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
            el.addEventListener(listener.type, (e) => {
                e.preventDefault();
                listener.callback(e, ...listener.args);
            })
        }
    
        return el;
    }

}