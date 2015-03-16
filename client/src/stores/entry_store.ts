import FluxxorStore = require('fluxxor/lib/store');
import Api = require('../api');

export class State {
    list: Api.EntryListItem[] = [];
    isFetched: boolean = false;
}

export class Store extends FluxxorStore {
    state = new State;
    
    constructor(){
        super();
        
        this.bindActions(
            'entry:set', this.onSet.bind(this)
        );
    }
    
    onSet(payload: Api.EntryListItem[]) {
        this.state.list = payload;
        this.state.isFetched = true;
        this.emit("change");
    }
}
