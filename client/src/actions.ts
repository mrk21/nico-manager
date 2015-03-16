import Action = require('./actions/base');
import SessionAction = require('./actions/session_action');
import EntryAction = require('./actions/entry_action');

class Actions {
    session = {
        show: Action.handler(SessionAction.Show),
        create: Action.handler(SessionAction.Create),
        destroy: Action.handler(SessionAction.Destroy)
    };
    entry = {
        index: Action.handler(EntryAction.Index)
    };
}

export = Actions;
