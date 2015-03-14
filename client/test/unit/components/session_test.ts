///<reference path="../../../src/_reference.d.ts" />

import assert = require("power-assert")
import sinon = require('sinon');
import initDom = require('../init_dom');

import React = require('react/addons');
import Fluxxor = require('fluxxor');
import Session = require('../../../src/components/session');
import Stores = require('../../../src/stores');
import Actions = require('../../../src/actions');

var TestUtils = React.addons.TestUtils;

(initDom ? describe : describe.skip)('components/session', () => {
    var actions: Actions;
    var stores: Stores;
    
    beforeEach(() => {
        initDom();
        actions = new Actions();
        stores = new Stores();
    });
    
    describe('submit', () => {
        it('should invoke session.create action', () => {
            var mock = sinon.mock(actions.session);
            mock.expects('create').once();
            
            var element = TestUtils.renderIntoDocument(
                React.createElement(Session, {
                    flux: new Fluxxor.Flux(stores, actions)
                })
            );
            var form = TestUtils.findRenderedDOMComponentWithTag(
                element, 'form'
            );
            TestUtils.Simulate.submit(form);
            assert(mock.verify());
        });
    });
});
