import SessionStore = require('./stores/session_store');

class Stores {
    SessionStore = new SessionStore.Store();
};

export = Stores;
