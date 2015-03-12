///<reference path="../typings/bundle.d.ts" />
///<reference path="../node_modules/ts-jsx-loader/react-jsx.d.ts" />
///<reference path="../node_modules/typed-react/typed-react.d.ts" />

declare module "fluxxor/lib/store" {
    class Store extends EventEmitter3.EventEmitter implements Fluxxor.Store {
        bindActions(...args: Array<string|Function>): void;
        bindActions(args: Array<string|Function>): void;
        waitFor(stores: string[], fn: Function): void;
    }
    export = Store;
}
