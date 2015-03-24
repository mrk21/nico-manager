///<reference path="../../../src/_reference.d.ts" />
import assert = require("power-assert")
import request = require('superagent');
import nock = require('nock');
import sinon = require('sinon');
import EntryAction = require('../../../src/actions/entry_action');
import Api = require('../../../src/api');

(nock ? describe : describe.skip)('stores/entry_action', () => {
    afterEach(() => nock.cleanAll());
    
    describe('Index', () => {
        var response = {
            status: 200,
            body: <any>[{
                video: {video_id: 'sm9'}
            }]
        };
        
        beforeEach(() => nock('http://localhost')
            .get('/api/entries')
            .reply(response.status, response.body)
        );
        
        it('should dispatch with "entry:set" and the entry data', (done) => {
            var action = new EntryAction.Index();
            var spy = sinon.spy(action, 'dispatch');
            action.handler();
            setTimeout(() => {
                assert(spy.withArgs("entry:set", response.body).calledOnce);
                done();
            }, 10);
        });
        
        context('when not authenticated', () => {
            before(() => {
                response = {
                    status: 401,
                    body: <any>{
                        message: 'Not authenticated'
                    }
                };
            });
            
            it('should dispatch with "session:unset" action and the error message', (done) => {
                var action = new EntryAction.Index();
                var spy = sinon.spy(action, 'dispatch');
                action.handler();
                setTimeout(() => {
                    assert(spy.withArgs("session:unset", response.body).calledOnce);
                    done();
                }, 10);
            });
        });
    });
});
