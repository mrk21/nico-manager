///<reference path="../../../src/_reference.d.ts" />
import assert = require("power-assert")
import sinon = require('sinon');
import initDom = require('../init_dom');

import React = require('react/addons');
import MylistListComponent = require('../../../src/components/mylist_list_component');
import Helper = require('./helper');

var TestUtils = React.addons.TestUtils;

class MyHelper extends Helper<MylistListComponent.Component> {}

(initDom ? describe : describe.skip)('components/mylist_list_component', () => {
    var helper: MyHelper;
    var mylistActionMock: SinonMock;
    
    var helperCallback = (helper: MyHelper) => {
        mylistActionMock = sinon.mock(helper.actions.mylist);
        mylistActionMock.expects('index').once();
    }
    
    beforeEach((done) => {
        helper = new MyHelper(MylistListComponent.Component, {}, done, helperCallback);
    });
    
    context('when mounted', () => {
        it('should invoke mylist.index action', () => {
            assert(mylistActionMock.verify());
        });
        
        it('should render an empty view', () => {
            assert(helper.component.getDOMNode<HTMLElement>().innerHTML === '');
        });
    });
    
    context('when initialized', () => {
        beforeEach(() => {
            helper.stores.mylist.onSet([<any>{
                group_id: 1
            }]);
        });
        
        it('should exist a mylist list', () => {
            assert(helper.component.refs['mylistList'] !== undefined);
        });
    });
});
