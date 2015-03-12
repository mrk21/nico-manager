import Action = require('./actions/base');
import SessionAction = require('./actions/session_action');

var actions = {
    session: {
        show: Action.handler(SessionAction.Show),
        create: Action.handler(SessionAction.Create),
        destroy: Action.handler(SessionAction.Destroy)
    }
};

export = actions;
