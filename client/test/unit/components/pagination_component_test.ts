///<reference path="../../../src/_reference.d.ts" />
import assert = require("power-assert")
import sinon = require('sinon');
import initDom = require('../init_dom');

import React = require('react/addons');
import PaginationComponent = require('../../../src/components/pagination_component');
import Helper = require('./helper');

var TestUtils = React.addons.TestUtils;

class MyHelper extends Helper<PaginationComponent.Component> {}

(initDom ? describe : describe.skip)('components/pagination_component', () => {
    var helper: MyHelper;
    var helperCallback = (helper: MyHelper) => {}
    var props: PaginationComponent.Props;
    
    before(() => {
        props = {
            flux: null,
            total: 100,
            perPage: 30,
            currentPage: 2,
            getLinkProps: (page) => {
                return {
                    to: 'home',
                    params: {},
                    query: {p: page}
                };
            }
        };
    });
    
    beforeEach((done) => {
        helper = new MyHelper(PaginationComponent.Component, props, done, helperCallback);
    });
    
    context('when mounted', () => {
        it('should exist page links', () => {
            var count = 0;
            for (var key in helper.component.refs) {
                if (key.match(/link\./)) count++;
            }
            assert(count === 4);
        });
        
        it('should set "is-active" class to the current page element', () => {
            var activeElement = helper.component.refs[`link.${props.currentPage}`];
            assert(activeElement.getDOMNode<HTMLElement>().className.match('is-active'));
        });
    });
});
