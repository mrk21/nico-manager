///<reference path="../../../src/_reference.d.ts" />
import assert = require("power-assert")
import sinon = require('sinon');
import initDom = require('../init_dom');

import React = require('react/addons');
import SessionComponent = require('../../../src/components/session_component');
import SessionStore = require('../../../src/stores/session_store');
import Helper = require('./helper');

var TestUtils = React.addons.TestUtils;

class MyHelper extends Helper<SessionComponent.Component> {}

(initDom ? describe : describe.skip)('components/session_component', () => {
    var helper: MyHelper;
    var helperCallback = (helper: MyHelper) => {}
    
    beforeEach((done) => {
        helper = new MyHelper(SessionComponent.Component, done, helperCallback);
    });
    
    context('when submitted', () => {
        var actionsMock: SinonMock;
        var auth = {
            mail: 'hoge@fuga.com',
            password: 'pass'
        };
        
        before(() => {
            helperCallback = (helper: MyHelper) => {
                actionsMock = sinon.mock(helper.actions.session);
                actionsMock.expects('create').withArgs(auth).once();
            }
        });
        
        it('should invoke session.create action', () => {
            helper.component.state.mail = auth.mail;
            helper.component.state.password = auth.password;
            
            TestUtils.Simulate.submit(helper.component.refs['form'].getDOMNode());
            assert(actionsMock.verify());
        });
        
        context('when authentication succeed', () => {
            it('should transition to the root', () => {
                var spy = sinon.spy(helper.component, 'transitionTo');
                helper.stores.session.state.auth = SessionStore.AuthState.AUTHENTICATED;
                helper.stores.session.emit('change');
                assert(spy.withArgs('/').calledOnce);
            });
        });
        
        context('when authentication failed', () => {
            it('should display an error message', () => {
                helper.stores.session.state.auth = SessionStore.AuthState.AUTHENTICATION_FAILED;
                helper.stores.session.emit('change');
                var errorMessage = helper.component.refs['errorMessage'].getDOMNode<HTMLElement>();
                assert(errorMessage.innerHTML != '');
            });
        });
    });
});
