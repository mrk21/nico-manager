///<reference path="../../../src/_reference.d.ts" />

import assert = require("power-assert")
import sinon = require('sinon');
import initDom = require('../init_dom');

import React = require('react/addons');
import Fluxxor = require('fluxxor');
import SessionComponent = require('../../../src/components/session_component');
import SessionStore = require('../../../src/stores/session_store');
import Stores = require('../../../src/stores');
import Actions = require('../../../src/actions');

var TestUtils = React.addons.TestUtils;

(initDom ? describe : describe.skip)('components/session_component', () => {
    var actions: Actions;
    var stores: Stores;
    var component: SessionComponent.Component;
    
    function createComponent(){
        component = TestUtils.renderIntoDocument<SessionComponent.Component>(
            React.createElement(SessionComponent.ComponentClass, {
                flux: new Fluxxor.Flux(stores, actions)
            })
        );
    }
    
    beforeEach(() => {
        initDom();
        actions = new Actions();
        stores = new Stores();
    });
    
    context('when submitted', () => {
        it('should invoke session.create action', () => {
            var auth = {
                mail: 'hoge@fuga.com',
                password: 'pass'
            };
            var mock = sinon.mock(actions.session);
            mock.expects('create').withArgs(auth).once();
            
            createComponent();
            component.state.mail = auth.mail;
            component.state.password = auth.password;
            
            TestUtils.Simulate.submit(component.refs['form'].getDOMNode());
            assert(mock.verify());
        });
        
        context('when authentication succeed', () => {
            it('should transition to the root', () => {
                createComponent();
                (<any>component).transitionTo = () => {};
                var spy = sinon.spy(component, 'transitionTo');
                stores.session.state.auth = SessionStore.AuthState.AUTHENTICATED;
                stores.session.emit('change');
                assert(spy.withArgs('/').calledOnce);
            });
        });
        
        context('when authentication failed', () => {
            it('should display an error message', () => {
                createComponent();
                stores.session.state.auth = SessionStore.AuthState.AUTHENTICATION_FAILED;
                stores.session.emit('change');
                var errorMessage = component.refs['errorMessage'].getDOMNode<HTMLElement>();
                assert(errorMessage.innerHTML != '');
            });
        });
    });
});
