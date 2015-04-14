///<reference path="../../../src/_reference.d.ts" />
import assert = require("power-assert")
import request = require('superagent');
import nock = require('nock');
import sinon = require('sinon');
import MylistAction = require('../../../src/actions/mylist_action');
import Api = require('../../../src/api');

(nock ? describe : describe.skip)('stores/mylist_action', () => {
    afterEach(() => nock.cleanAll());
    
    describe('Index', () => {
        var response = {
            status: 200,
            body: <any>[{
                group_id: 1
            }]
        };
        
        beforeEach(() => nock('http://localhost')
            .get('/api/mylists')
            .reply(response.status, response.body)
        );
        
        it('should dispatch with "mylist:set" and the mylist data', (done) => {
            var action = new MylistAction.Index();
            var spy = sinon.spy(action, 'dispatch');
            action.handler();
            setTimeout(() => {
                assert(spy.withArgs("mylist:set", response.body).calledOnce);
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
                var action = new MylistAction.Index();
                var spy = sinon.spy(action, 'dispatch');
                action.handler();
                setTimeout(() => {
                    assert(spy.withArgs("session:unset", response.body).calledOnce);
                    done();
                }, 10);
            });
        });
    });
    
    describe('Entry', () => {
        var response = {
            status: 200,
            body: <any>[{
                video: {video_id: 'sm9'}
            }]
        };
        var groupId = 1;
        
        beforeEach(() => nock('http://localhost')
            .get(`/api/mylists/${groupId}/entries`)
            .reply(response.status, response.body)
        );
        
        it('should dispatch with "entry:set" and the entry data', (done) => {
            var action = new MylistAction.Entry();
            var spy = sinon.spy(action, 'dispatch');
            action.handler(groupId);
            setTimeout(() => {
                assert(spy.withArgs("entry:set", {records: response.body}).calledOnce);
                done();
            }, 10);
        });
    });
});
