import React = require("react");
import TypedReact = require("typed-react");
import Fluxxor = require('fluxxor');
import Router = require('react-router');

export interface Props {
    flux: Fluxxor.Flux;
}

export interface State {}

export class Spec<P extends Props, S extends State> extends TypedReact.Component<P,S> implements
    Fluxxor.FluxMixin,
    Fluxxor.StoreWatchMixin<S>,
    Router.Navigation
{
    // Flux mixin
    getFlux: () => Fluxxor.Flux;
    
    // FluxStoreWatch mixin required
    getStateFromFlux(): S {
        return <S>{};
    }
    
    // Navigation Mixin
    makePath: (to: string, params?: {}, query?: {}) => string;
    makeHref: (to: string, params?: {}, query?: {}) => string;
    transitionTo: (to: string, params?: {}, query?: {}) => void;
    replaceWith: (to: string, params?: {}, query?: {}) => void;
    goBack: () => void;
}

interface SpecClass<P,S> {
    new (): TypedReact.Component<P,S>;
}

export function createClass<P extends Props, S extends State>(spec: SpecClass<P,S>, watchStores?: string[], mixins?: React.Mixin<P,S>[]) {
    var baseMixins: React.Mixin<P,S>[] = [
        Fluxxor.FluxMixin(React),
        Router.Navigation
    ];
    if (watchStores) {
        baseMixins.push(
            Fluxxor.StoreWatchMixin.apply(this, watchStores)
        );
    }
    baseMixins = baseMixins.concat(mixins);
    
    return TypedReact.createClass(spec, baseMixins);
};
