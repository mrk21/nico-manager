import FluxxorStore = require('fluxxor/lib/store');
import Api = require('../api');

export enum AuthState {
    NOT_AUTHENTICATED,
    AUTHENTICATED,
    AUTHENTICATION_FAILED
}

export class State {
    user = new Api.Session;
    auth: AuthState = AuthState.NOT_AUTHENTICATED;
}

export class Store extends FluxxorStore {
    state = new State;
    
    constructor(){
        super();
        
        this.bindActions(
            'session:set', this.onSet.bind(this),
            'session:unset', this.onUnset.bind(this),
            'session:invalid', this.onInvalid.bind(this)
        );
    }
    
    onSet(payload: Api.Session) {
        this.state.user = payload;
        this.state.auth = AuthState.AUTHENTICATED;
        this.emit("change");
    }
    
    onInvalid(payload: Api.Message) {
        this.state.user = new Api.Session;
        this.state.auth = AuthState.AUTHENTICATION_FAILED;
        this.emit("change");
    }
    
    onUnset(payload: Api.Message) {
        this.state.user = new Api.Session;
        this.state.auth = AuthState.NOT_AUTHENTICATED;
        this.emit("change");
    }
}
