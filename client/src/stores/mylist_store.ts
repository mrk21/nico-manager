import FluxxorStore = require('fluxxor/lib/store');
import Api = require('../api');

export class State {
    list: Api.MylistListItem[] = [];
    isFetched: boolean = false;
}

export class Store extends FluxxorStore {
    state = new State;
    
    constructor(){
        super();
        
        this.bindActions(
            'mylist:set', this.onSet.bind(this)
        );
    }
    
    onSet(payload: Api.MylistListItem[]) {
        this.state.list = payload;
        this.state.isFetched = true;
        this.emit("change");
    }
}
