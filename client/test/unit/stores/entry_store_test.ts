///<reference path="../../../src/_reference.d.ts" />
import assert = require("power-assert")
import request = require('superagent');
import sinon = require('sinon');
import EntryStore = require('../../../src/stores/entry_store');
import Api = require('../../../src/api');

describe('stores/entry_store', () => {
    var instance: EntryStore.Store;
    
    beforeEach(() => {
        instance = new EntryStore.Store();
    });
    
    describe('onSet(payload)', () => {
        context('when the payload not had range property', () => {
            it('should set this range property', () => {
                instance.onSet({
                    records: [
                        <any>{},
                        <any>{},
                        <any>{}
                    ]
                });
                
                assert(JSON.stringify(instance.state.range) === JSON.stringify({
                    since: 0,
                    until: 2,
                    total: 3
                }));
            });
        });
    });
});
