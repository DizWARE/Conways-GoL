function $(selector, container) {
    return (container || document).querySelector(selector);
}

// Helpers
// Warning: Only clones 2D arrays
function cloneArray(array) {
    return array.map((row) => [...row]);
}
