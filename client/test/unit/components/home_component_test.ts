///<reference path="../../../src/_reference.d.ts" />
import assert = require("power-assert")
import sinon = require('sinon');
import initDom = require('../init_dom');

import React = require('react/addons');
import HomeComponent = require('../../../src/components/home_component');
import Helper = require('./helper');

var TestUtils = React.addons.TestUtils;

class MyHelper extends Helper<HomeComponent.Component> {}

(initDom ? describe : describe.skip)('components/home_component', () => {
    var helper: MyHelper;
    var actionsMock: SinonMock;
    
    var helperCallback = (helper: MyHelper) => {
        actionsMock = sinon.mock(helper.actions.entry);
        actionsMock.expects('index').once();
    }
    
    beforeEach((done) => {
        helper = new MyHelper(HomeComponent.Component, done, helperCallback);
    });
    
    context('when mounted', () => {
        it('should invoke session.show action', () => {
            assert(actionsMock.verify());
        });
        
        it('should render an empty view', () => {
            assert(helper.component.getDOMNode<HTMLElement>().innerHTML === '');
        });
    });
    
    context('when initialized', () => {
        beforeEach(() => {
            helper.stores.entry.onSet([{
                video_id: 'sm123',
                title: 'hoge',
                thumbnail_url: 'http://hoge.com/foo.jpg'
            }])
        });
        
        it('should exist an entry list', () => {
            assert(helper.component.refs['entryList'] !== undefined);
        });
    });
});
