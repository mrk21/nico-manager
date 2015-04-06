///<reference path="../../../src/_reference.d.ts" />
import assert = require("power-assert")
import sinon = require('sinon');
import initDom = require('../init_dom');

import React = require('react/addons');
import TagListComponent = require('../../../src/components/tag_list_component');
import Helper = require('./helper');

var TestUtils = React.addons.TestUtils;

class MyHelper extends Helper<TagListComponent.Component> {}

(initDom ? describe : describe.skip)('components/tag_list_component', () => {
    var helper: MyHelper;
    var tagActionMock: SinonMock;
    
    var helperCallback = (helper: MyHelper) => {
        tagActionMock = sinon.mock(helper.actions.tag);
        tagActionMock.expects('index').once();
    }
    
    beforeEach((done) => {
        helper = new MyHelper(TagListComponent.Component, {}, done, helperCallback);
    });
    
    context('when mounted', () => {
        it('should invoke tag.index action', () => {
            assert(tagActionMock.verify());
        });
        
        it('should render an empty view', () => {
            assert(helper.component.getDOMNode<HTMLElement>().innerHTML === '');
        });
    });
    
    context('when initialized', () => {
        beforeEach(() => {
            helper.stores.tag.onSet([<any>{
                name: 'tag1',
                count: 3
            }]);
        });
        
        it('should exist a tag list', () => {
            assert(helper.component.refs['tagList'] !== undefined);
        });
    });
});
