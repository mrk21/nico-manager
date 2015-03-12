import Fluxxor = require('fluxxor');

export class Base<Payload> {
    flux: Fluxxor.Flux;
    dispatch(type: string, payload: Payload): void {}
    handler(...args: any[]): void {}
}

export function handler(action: Function): Function {
    return action.prototype.handler;
}
