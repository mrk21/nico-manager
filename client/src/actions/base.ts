import Fluxxor = require('fluxxor');

export class Base<Payload> {
    flux: Fluxxor.Flux;
    dispatch(type: string, payload: Payload): void {}
    handler(...args: any[]): void {}
}

export function handler(Action: Function): Function {
    var action = new (<any>Action)();
    return function(...args: any[]) {
        action.flux = this.flux;
        action.dispatch = this.dispatch.bind(this);
        action.handler.apply(action, args);
    };
}
