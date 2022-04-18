let common = {};
common.isObject = function (object) {
    return typeof object === 'object' && object !== null;
};
common.clone = function clone(object, target, onconflict = 'overwrite') {
    if (!common.isObject(object)) return object;
    let cloned = target ?? (Array.isArray(object) ? [] : {});
    for (let key of Object.keys(object)) {
        if (onconflict !== 'overwrite' && (key in cloned)) {
            if (typeof onconflict === 'function') {
                cloned[key] = onconflict(key, cloned, object);
            } else if (onconflict === 'error') {
                throw new Error(`Key '${key}' already exists in the target.`);
            }
        } else {
            if (common.isObject(object[key]) && target) {
                clone(object[key], cloned[key]);
            } else {
                cloned[key] = clone(object[key], cloned[key]);
            }
        }
    }
    return cloned;
};
common.createElement = function (tag, attributes, parent) {
    let element = document.createElement(tag);
    common.clone(attributes, element);
    if (parent !== undefined) {
        parent.appendChild(element);
    }
    return element;
};