import SessionStore = require('./stores/session_store');
import EntryStore = require('./stores/entry_store');

class Stores {
    session = new SessionStore.Store();
    entry = new EntryStore.Store();
};

export = Stores;
