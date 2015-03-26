import Action = require('./base');

function dispatchLoader(action: Action.Base<any>, callback: (done: Function) => void) {
    setTimeout(() => action.dispatch('app:loading', null), 0);
    callback(() => {
        setTimeout(() => action.dispatch('app:load', null), 0);
    });
}

export = dispatchLoader;
