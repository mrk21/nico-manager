import SessionStore = require('./stores/session_store');

class Stores {
    session = new SessionStore.Store();
};

export = Stores;
