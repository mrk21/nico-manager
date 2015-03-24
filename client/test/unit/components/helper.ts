///<reference path="../../../src/_reference.d.ts" />
import React = require('react/addons');
import Fluxxor = require('fluxxor');
import Stores = require('../../../src/stores');
import Actions = require('../../../src/actions');

var TestUtils = React.addons.TestUtils;

class Helper<ComponentType extends React.CompositeComponent<any,any>> {
    context: any;
    actions: Actions;
    stores: Stores;
    component: ComponentType;
    
    constructor(
        componentClass: React.ComponentClass<any>,
        done: Function,
        callback?: (helper: Helper<ComponentType>) => void
    ) {
        this.context = {
            makePath: () => {},
            makeHref: () => {},
            transitionTo: () => {},
            replaceWith: () => {},
            goBack: () => {},
            
            getCurrentPath: () => {},
            getCurrentRoutes: () => {},
            getCurrentPathname: () => {},
            getCurrentParams: () => {},
            getCurrentQuery: () => {},
            isActive: (to: string, params: {}, query: {}) => {},
            
            getRouteAtDepth: () => {},
            setRouteComponentAtDepth: () => {},
            routeHandlers: <any[]>[]
        };
        
        this.actions = new Actions();
        this.stores = new Stores();
        
        if (callback) callback(this);
        
        (<any>React).withContext(this.context, () => {
            this.component = TestUtils.renderIntoDocument<ComponentType>(
                React.createElement(componentClass, {
                    flux: new Fluxxor.Flux(this.stores, this.actions)
                })
            );
            done();
        });
    }
}

export = Helper;
