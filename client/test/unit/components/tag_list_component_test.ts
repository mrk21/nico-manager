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
    var props: TagListComponent.Props;
    
    var helperCallback = (helper: MyHelper) => {
        tagActionMock = sinon.mock(helper.actions.tag);
        tagActionMock.expects('index').once();
    }
    
    before(() => {
        props = {
            flux: null,
        };
    });
    
    beforeEach((done) => {
        helper = new MyHelper(TagListComponent.Component, props, done, helperCallback);
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
            helper.stores.tag.onSet([
                <any>{name: 'tag1', count: 5},
                <any>{name: 'tag2', count: 4},
                <any>{name: 'tag3', count: 3},
                <any>{name: 'tag4', count: 2},
                <any>{name: 'tag5', count: 1},
            ]);
        });
        
        it('should exist a tag list', () => {
            assert(helper.component.refs['tagList'] !== undefined);
        });
        
        it('should exist all tags', () => {
            var count = 0;
            for (var key in helper.component.refs) {
                if (key.match(/tagListItem\./)) count++;
            }
            assert(count === 5);
        });
        
        it('should not exist a link to all tags', () => {
            assert(helper.component.refs['toAllTags'] === undefined);
        });
        
        context('with limit prop', () => {
            before(() => {
                props = {
                    flux: null,
                    limit: 2
                };
            });
            
            it('should exist tags limited by the limit prop', () => {
                var count = 0;
                for (var key in helper.component.refs) {
                    if (key.match(/tagListItem\./)) count++;
                }
                assert(count === props.limit);
            });
            
            it('should exist a link to all tags', () => {
                assert(helper.component.refs['toAllTags'] !== undefined);
            });
        });
    });
});
