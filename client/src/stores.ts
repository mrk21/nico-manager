import SessionStore = require('./stores/session_store');
import EntryStore = require('./stores/entry_store');
import TagStore = require('./stores/tag_store');

class Stores {
    session = new SessionStore.Store();
    entry = new EntryStore.Store();
    tag = new TagStore.Store();
};

export = Stores;
