import Action = require('./actions/base');
import SessionAction = require('./actions/session_action');
import EntryAction = require('./actions/entry_action');
import TagAction = require('./actions/tag_action');
import MylistAction = require('./actions/mylist_action');
import AppAction = require('./actions/app_action');

class Actions {
    session = {
        show: Action.handler(SessionAction.Show),
        create: Action.handler(SessionAction.Create),
        destroy: Action.handler(SessionAction.Destroy)
    };
    entry = {
        index: Action.handler(EntryAction.Index)
    };
    tag = {
        index: Action.handler(TagAction.Index),
        entry: Action.handler(TagAction.Entry)
    };
    mylist = {
        index: Action.handler(MylistAction.Index),
        entry: Action.handler(MylistAction.Entry)
    };
    app = {
        loading: Action.handler(AppAction.Loading),
        load: Action.handler(AppAction.Load)
    };
}

export = Actions;
