import Action = require('./base');

export class Loading extends Action.Base<any> {
    handler() {
        this.dispatch('app:loading', null);
    }
}

export class Load extends Action.Base<any> {
    handler() {
        this.dispatch('app:load', null);
    }
}
