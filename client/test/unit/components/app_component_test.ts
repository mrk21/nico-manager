///<reference path="../../../src/_reference.d.ts" />
import assert = require("power-assert")
import sinon = require('sinon');
import initDom = require('../init_dom');

import React = require('react/addons');
import AppComponent = require('../../../src/components/app_component');
import SessionStore = require('../../../src/stores/session_store');
import Helper = require('./helper');

var TestUtils = React.addons.TestUtils;

class MyHelper extends Helper<AppComponent.Component> {}

(initDom ? describe : describe.skip)('components/app_component', () => {
    var helper: MyHelper;
    var actionsMock: SinonMock;
    
    var helperCallback = (helper: MyHelper) => {
        actionsMock = sinon.mock(helper.actions.session);
        actionsMock.expects('show').once();
    }
    
    beforeEach((done) => {
        helper = new MyHelper(AppComponent.Component, done, helperCallback);
    });
    
    context('when mounted', () => {
        it('should invoke session.show action', () => {
            assert(actionsMock.verify());
        });
        
        it('should render an empty view', () => {
            assert(helper.component.getDOMNode<HTMLElement>().innerHTML === '');
        });
    });
    
    context('when not authenticated', () => {
        beforeEach(() => {
            helper.stores.session.state.auth = SessionStore.AuthState.NOT_AUTHENTICATED;
            helper.stores.session.emit('change');
        });
        
        it('should exist a sign-in link', () => {
            assert(helper.component.refs['signIn'] !== undefined);
        });
    });
    
    context('when authenticated', () => {
        beforeEach(() => {
            helper.stores.session.state.auth = SessionStore.AuthState.AUTHENTICATED;
            helper.stores.session.emit('change');
        });
        
        it('should exist a sign-out button', () => {
            assert(helper.component.refs['signOut'] !== undefined);
        });
        
        context('when authentication abrogated', () => {
            before(() => {
                helperCallback = (helper) => {
                    actionsMock = sinon.mock(helper.actions.session);
                    actionsMock.expects('show').once();
                    actionsMock.expects('destroy').once();
                }
            });
            
            it('should invoke session.destroy action', () => {
                TestUtils.Simulate.click(helper.component.refs['signOut'].getDOMNode());
                assert(actionsMock.verify());
            });
        });
    });
});
