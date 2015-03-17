///<reference path="../../../src/_reference.d.ts" />
import assert = require("power-assert")
import sinon = require('sinon');
import initDom = require('../init_dom');

import React = require('react/addons');
import SigninFormComponent = require('../../../src/components/signin_form_component');
import SessionStore = require('../../../src/stores/session_store');
import Helper = require('./helper');

var TestUtils = React.addons.TestUtils;

class MyHelper extends Helper<SigninFormComponent.Component> {}

(initDom ? describe : describe.skip)('components/signin_form_component', () => {
    var helper: MyHelper;
    var helperCallback = (helper: MyHelper) => {}
    
    beforeEach((done) => {
        helper = new MyHelper(SigninFormComponent.Component, done, helperCallback);
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
            
            TestUtils.Simulate.submit(helper.component.getDOMNode());
            assert(actionsMock.verify());
        });
        
        context('when authentication failed', () => {
            it('should exist an error message', () => {
                helper.stores.session.state.auth = SessionStore.AuthState.AUTHENTICATION_FAILED;
                helper.stores.session.emit('change');
                assert(helper.component.refs['errorMessage'] !== undefined);
            });
        });
    });
});
