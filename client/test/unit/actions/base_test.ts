///<reference path="../../../src/_reference.d.ts" />
import assert = require("power-assert")
import request = require('superagent');
import nock = require('nock');
import sinon = require('sinon');
import Action = require('../../../src/actions/base');

class ActionTest extends Action.Base<any> {
    handler(...args: any[]) {
        this.dispatch('dummy-event', {flux: this.flux, args: args});
    }
}


describe('actions/base', () => {
    describe('handler(Action)', () => {
        it('should replace the flux property and the dispatch method', () => {
            var handler = Action.handler(ActionTest);
            var binder = {
                flux: 1,
                dispatch: () => {}
            };
            var spy = sinon.spy(binder, 'dispatch');
            var dispatcedHandler = handler.bind(binder);
            dispatcedHandler(1,2,3);
            
            assert(spy.withArgs('dummy-event', {flux: 1, args: [1,2,3]}).calledOnce);
        })
    });
});
