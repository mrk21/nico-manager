///<reference path="../../../src/_reference.d.ts" />
import assert = require("power-assert")
import request = require('superagent');
import nock = require('nock');
import sinon = require('sinon');
import SessionAction = require('../../../src/actions/session_action');
import Api = require('../../../src/api');

(nock ? describe : describe.skip)('stores/session_action', () => {
    afterEach(() => nock.cleanAll());
    
    describe('Show', () => {
        var response = {
            status: 200,
            body: <any>{
                user_id: '123',
                nickname: 'hoge',
                avatar: 'http://hoge.com/bar.jpg'
            }
        };
        
        beforeEach(() => nock('http://localhost')
            .get('/api/session')
            .reply(response.status, response.body)
        );
        
        it('should dispatch with "session:set" and the user data', (done) => {
            var action = new SessionAction.Show();
            var spy = sinon.spy(action, 'dispatch');
            action.handler();
            setTimeout(() => {
                assert(spy.withArgs("session:set", response.body).calledOnce);
                done();
            }, 10);
        });
        
        context('when not authenticated', () => {
            before(() => {
                response = {
                    status: 400,
                    body: <any>{
                        message: 'Not authenticated'
                    }
                };
            });
            
            it('should dispatch with "session:unset" and the error message', (done) => {
                var action = new SessionAction.Show();
                var spy = sinon.spy(action, 'dispatch');
                action.handler();
                setTimeout(() => {
                    assert(spy.withArgs("session:unset", response.body).calledOnce);
                    done();
                }, 10);
            });
        });
    });
    
    describe('Create', () => {
        var auth: Api.SessionAuth = {
            mail: 'hoge@foo.com',
            password: 'pass'
        };
        var response = {
            status: 200,
            body: <any>{
                user_id: '123',
                nickname: 'hoge',
                avatar: 'http://hoge.com/bar.jpg'
            }
        };
        
        beforeEach(() => nock('http://localhost')
            .post('/api/session', {auth: auth})
            .reply(response.status, response.body)
        );
        
        it('should dispatch with "session:set" and the user data', (done) => {
            var action = new SessionAction.Create();
            var spy = sinon.spy(action, 'dispatch');
            action.handler(auth);
            setTimeout(() => {
                assert(spy.withArgs("session:set", response.body).calledOnce);
                done();
            }, 10);
        });
        
        context('when authentication failed', () => {
            before(() => {
                response = {
                    status: 400,
                    body: <any>{
                        message: 'Authentication failed'
                    }
                };
            });
            
            it('should dispatch with "session:invalid" and the error message', (done) => {
                var action = new SessionAction.Create();
                var spy = sinon.spy(action, 'dispatch');
                action.handler(auth);
                setTimeout(() => {
                    assert(spy.withArgs("session:invalid", response.body).calledOnce);
                    done();
                }, 10);
            });
        });
    });
    
    describe('Destroy', () => {
        var response = {
            status: 200,
            body: <any>{
                message: 'Session deleted'
            }
        };
        
        beforeEach(() => nock('http://localhost')
            .delete('/api/session')
            .reply(response.status, response.body)
        );
        
        it('should dispatch with "session:unset" and the OK message', (done) => {
            var action = new SessionAction.Destroy();
            var spy = sinon.spy(action, 'dispatch');
            action.handler();
            setTimeout(() => {
                assert(spy.withArgs("session:unset", response.body).calledOnce);
                done();
            }, 10);
        });
    });
});
