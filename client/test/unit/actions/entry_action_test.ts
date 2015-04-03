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
        var response: {
            status: number;
            body: any;
        };
        var range: Api.Range;
        
        before(() => {
            range = null
            response = {
                status: 200,
                body: <any>[{
                    video: {video_id: 'sm9'}
                }]
            };
        });
        
        beforeEach(() => {
            var scope = nock('http://localhost').get('/api/entries');
            
            if (range) {
                scope.matchHeader('Range', `records=${range.since}-${range.until}`);
                scope.reply(response.status, response.body, {'Accept-Ranges': 'records', 'Content-Range': '1-2/3'});
            }
            else {
                scope.reply(response.status, response.body);
            }
        });
        
        it('should dispatch with "entry:set" and the entry data', (done) => {
            var action = new EntryAction.Index();
            var spy = sinon.spy(action, 'dispatch');
            var payload = {
                records: response.body
            };
            action.handler();
            setTimeout(() => {
                assert(spy.withArgs("entry:set", payload).calledOnce);
                done();
            }, 10);
        });
        
        context('with the range argument', () => {
            before(() => {
                response = {
                    status: 206,
                    body: [{
                        video: {video_id: 'sm9'}
                    }]
                };
                range = {
                    since: 1,
                    until: 2
                };
            });
            
            it('should dispatch with "entry:set" and the entry data', (done) => {
                var action = new EntryAction.Index();
                var spy = sinon.spy(action, 'dispatch');
                var payload = {
                    records: response.body,
                    range: {
                        since: 1,
                        until: 2
                    }
                };
                
                action.handler(null, payload.range);
                setTimeout(() => {
                    assert(spy.withArgs("entry:set", payload).calledOnce);
                    done();
                }, 10);
            });
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
