import jsdom = require('jsdom');

function init() {
    global.document = jsdom.jsdom('<html><body></body></html>');
    global.window = document.defaultView;
    global.navigator = window.navigator;
}
init();

export = init;
