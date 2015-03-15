///<reference path="../../../src/_reference.d.ts" />
import assert = require("power-assert")
import sinon = require('sinon');
import initDom = require('../init_dom');

import React = require('react/addons');
import Fluxxor = require('fluxxor');
import AppComponent = require('../../../src/components/app_component');
import SessionStore = require('../../../src/stores/session_store');
import Stores = require('../../../src/stores');
import Actions = require('../../../src/actions');

var TestUtils = React.addons.TestUtils;

(initDom ? describe : describe.skip)('components/app_component', () => {
    var actions: Actions;
    var stores: Stores;
    var component: AppComponent.Component;
    
    function createComponent(done: Function){
        var context = {
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
            isActive: () => {},
            
            getRouteAtDepth: () => {},
            setRouteComponentAtDepth: () => {},
            routeHandlers: <any[]>[]
        };
        
        (<any>React).withContext(context, () => {
            component = TestUtils.renderIntoDocument<AppComponent.Component>(
                React.createElement(AppComponent.Component, {
                    flux: new Fluxxor.Flux(stores, actions)
                })
            );
            done();
        });
    }
    
    var mockConfig = () => {
        mock.expects('show').once();
    };
    
    beforeEach(() => {
//         initDom();
        actions = new Actions();
        stores = new Stores();
    });
    
    var mock: SinonMock;
    
    beforeEach((done) => {
        mock = sinon.mock(actions.session);
        mockConfig();
        createComponent(done);
    });
    
    context('when initialized', () => {
        it('should invoke session.show action', () => {
            assert(mock.verify());
        });
        
        it('should render an empty view', () => {
            assert(component.getDOMNode<HTMLElement>().innerHTML === '');
        });
    });
    
    context('when not authenticated', () => {
        beforeEach(() => {
            stores.session.state.auth = SessionStore.AuthState.NOT_AUTHENTICATED;
            stores.session.emit('change');
        });
        
        it('should exist a sign-in link', () => {
            assert(component.refs['signIn'] !== undefined);
        });
    });
    
    context('when authenticated', () => {
        beforeEach(() => {
            stores.session.state.auth = SessionStore.AuthState.AUTHENTICATED;
            stores.session.emit('change');
        });
        
        it('should exist a sign-out button', () => {
            assert(component.refs['signOut'] !== undefined);
        });
        
        context('when authentication abrogated', () => {
            before(() => {
                mockConfig = () => {
                    mock.expects('show').once();
                    mock.expects('destroy').once();
                };
            });
            
            it('should invoke session.destroy action', () => {
                TestUtils.Simulate.click(component.refs['signOut'].getDOMNode());
                assert(mock.verify());
            });
        });
    });
});
