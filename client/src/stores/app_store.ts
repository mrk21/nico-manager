import FluxxorStore = require('fluxxor/lib/store');

export class State {
    loading: boolean = false;
}

export class Store extends FluxxorStore {
    state = new State;
    
    constructor(){
        super();
        
        this.bindActions(
            'app:loading', this.onLoading.bind(this),
            'app:load', this.onLoad.bind(this)
        );
    }
    
    onLoading() {
        this.state.loading = true;
        this.emit("change");
    }
    
    onLoad() {
        this.state.loading = false;
        this.emit("change");
    }
}
