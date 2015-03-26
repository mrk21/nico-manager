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
    var mylistActionMock: SinonMock;
    
    var helperCallback = (helper: MyHelper) => {
        entryActionMock = sinon.mock(helper.actions.entry);
        entryActionMock.expects('index').once();
        
        mylistActionMock = sinon.mock(helper.actions.mylist);
        mylistActionMock.expects('index').once();
        
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
        
        it('should invoke mylist.index action', () => {
            assert(mylistActionMock.verify());
        });
        
        it('should invoke tag.index action', () => {
            assert(tagActionMock.verify());
        });
        
        it('should render an empty view', () => {
            assert(helper.component.getDOMNode<HTMLElement>().innerHTML === '');
        });
        
        context('when specified a mylist', () => {
            var groupId = 1;
            
            before(() => {
                helperCallback = (helper: MyHelper) => {
                    sinon.stub(helper.context, 'isActive').withArgs('mylist_entries').returns(true);
                    sinon.stub(helper.context, 'getCurrentParams').returns({group_id: groupId});
                    
                    entryActionMock = sinon.mock(helper.actions.entry);
                    
                    mylistActionMock = sinon.mock(helper.actions.mylist);
                    mylistActionMock.expects('index').once();
                    mylistActionMock.expects('entry').withArgs(groupId).once();
                    
                    tagActionMock = sinon.mock(helper.actions.tag);
                    tagActionMock.expects('index').once();
                }
            });
            
            it('should invoke mylist.entry action with the mylist group_id', () => {
                assert(mylistActionMock.verify());
            });
        });
        
        context('when specified a tag', () => {
            var name = 'tag1';
            
            before(() => {
                helperCallback = (helper: MyHelper) => {
                    sinon.stub(helper.context, 'isActive').withArgs('tag_entries').returns(true);
                    sinon.stub(helper.context, 'getCurrentParams').returns({name: name});
                    
                    entryActionMock = sinon.mock(helper.actions.entry);
                    
                    mylistActionMock = sinon.mock(helper.actions.mylist);
                    mylistActionMock.expects('index').once();
                    
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
                mylist: {},
                entry: {},
                video: {video_id: 'sm123'}
            }]);
            helper.stores.mylist.onSet([<any>{
                group_id: 1
            }]);
            helper.stores.tag.onSet([<any>{
                name: 'tag1',
                count: 3
            }]);
        });
        
        it('should exist a search form', () => {
            assert(helper.component.refs['searchForm'] !== undefined);
        });
        
        it('should exist an entry list', () => {
            assert(helper.component.refs['entryList'] !== undefined);
        });
        
        it('should exist a mylist list', () => {
            assert(helper.component.refs['mylistList'] !== undefined);
        });
        
        it('should exist a tag list', () => {
            assert(helper.component.refs['tagList'] !== undefined);
        });
    });
});
