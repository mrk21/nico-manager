import SessionStore = require('./stores/session_store');

var stores = {
    SessionStore: new SessionStore.Store()
};

export = stores;
