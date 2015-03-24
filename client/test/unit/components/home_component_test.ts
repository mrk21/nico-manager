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
    var entryActionMock: SinonMock;
    var tagActionMock: SinonMock;
    
    var helperCallback = (helper: MyHelper) => {
        entryActionMock = sinon.mock(helper.actions.entry);
        entryActionMock.expects('index').once();
        
        tagActionMock = sinon.mock(helper.actions.tag);
        tagActionMock.expects('index').once();
    }
    
    beforeEach((done) => {
        helper = new MyHelper(HomeComponent.Component, done, helperCallback);
    });
    
    context('when mounted', () => {
        it('should invoke entry.index action', () => {
            assert(entryActionMock.verify());
        });
        
        it('should invoke tag.index action', () => {
            assert(tagActionMock.verify());
        });
        
        it('should render an empty view', () => {
            assert(helper.component.getDOMNode<HTMLElement>().innerHTML === '');
        });
        
        context('when specified a tag', () => {
            var name = 'tag1';
            
            before(() => {
                helperCallback = (helper: MyHelper) => {
                    sinon.stub(helper.context, 'isActive').withArgs('tag_entries').returns(true);
                    sinon.stub(helper.context, 'getCurrentParams').returns({name: name});
                    
                    tagActionMock = sinon.mock(helper.actions.tag);
                    tagActionMock.expects('index').once();
                    tagActionMock.expects('entry').withArgs(name).once();
                }
            });
            
            it('should invoke tag.entry action with the tag name', () => {
                assert(entryActionMock.verify());
            });
        });
    });
    
    context('when initialized', () => {
        beforeEach(() => {
            helper.stores.entry.onSet([<any>{
                video: {video_id: 'sm123'}
            }]);
            helper.stores.tag.onSet([<any>{
                name: 'tag1',
                count: 3
            }]);
        });
        
        it('should exist an entry list', () => {
            assert(helper.component.refs['entryList'] !== undefined);
        });
        
        it('should exist an tag list', () => {
            assert(helper.component.refs['tagList'] !== undefined);
        });
    });
});
