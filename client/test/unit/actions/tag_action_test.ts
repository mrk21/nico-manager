///<reference path="../../../src/_reference.d.ts" />
import assert = require("power-assert")
import request = require('superagent');
import nock = require('nock');
import sinon = require('sinon');
import TagAction = require('../../../src/actions/tag_action');
import Api = require('../../../src/api');

(nock ? describe : describe.skip)('stores/tag_action', () => {
    afterEach(() => nock.cleanAll());
    
    describe('Index', () => {
        var response = {
            status: 200,
            body: <any>[{
                name: 'tag1',
                count: 2
            }]
        };
        
        beforeEach(() => nock('http://localhost')
            .get('/api/tags')
            .reply(response.status, response.body)
        );
        
        it('should dispatch with "tag:set" and the tag data', (done) => {
            var action = new TagAction.Index();
            var spy = sinon.spy(action, 'dispatch');
            action.handler();
            setTimeout(() => {
                assert(spy.withArgs("tag:set", response.body).calledOnce);
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
                var action = new TagAction.Index();
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
        var name = 'tag1';
        
        beforeEach(() => nock('http://localhost')
            .get(`/api/tags/${name}/entries`)
            .reply(response.status, response.body)
        );
        
        it('should dispatch with "entry:set" and the entry data', (done) => {
            var action = new TagAction.Entry();
            var spy = sinon.spy(action, 'dispatch');
            action.handler(name);
            setTimeout(() => {
                assert(spy.withArgs("entry:set", {records: response.body}).calledOnce);
                done();
            }, 10);
        });
    });
});
