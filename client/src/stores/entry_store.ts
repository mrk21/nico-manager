import FluxxorStore = require('fluxxor/lib/store');
import Api = require('../api');

export class State {
    list: Api.EntryListItem[] = [];
    range: Api.Range;
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
    
    onSet(payload: Api.ListWithRange<Api.EntryListItem>) {
        this.state.list = payload.records;
        this.state.range = payload.range;
        if (!this.state.range) {
            this.state.range = {
                since: 0,
                until: this.state.list.length - 1,
                total: this.state.list.length
            };
        }
        this.state.isFetched = true;
        this.emit("change");
    }
}
