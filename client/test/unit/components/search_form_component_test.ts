///<reference path="../../../src/_reference.d.ts" />
import assert = require("power-assert")
import sinon = require('sinon');
import initDom = require('../init_dom');

import React = require('react/addons');
import SearchFormComponent = require('../../../src/components/search_form_component');
import Helper = require('./helper');

var TestUtils = React.addons.TestUtils;

class MyHelper extends Helper<SearchFormComponent.Component> {}

(initDom ? describe : describe.skip)('components/search_form_component', () => {
    var helper: MyHelper;
    var helperCallback: (helper: MyHelper) => void;
    
    before(() => {
        helperCallback = (helper: MyHelper) => {};
    });
    
    beforeEach((done) => {
        helper = new MyHelper(SearchFormComponent.Component, {}, done, helperCallback);
    });
    
    context('when mounted', () => {
        var query = {query1: 'aa', q: 'ee'};
        
        before(() => {
            helperCallback = (helper: MyHelper) => {
                sinon.stub(helper.context, 'getCurrentQuery').returns(query);
            };
        });
        
        it('should set "q" query of current URL to the input form', () => {
            assert(helper.component.state.text === query.q);
        });
    });
    
    context('when transitioned', () => {
        var query = {query1: 'aa', q: 'ee'};
        
        before(() => {
            helperCallback = (helper: MyHelper) => {
                sinon.stub(helper.context, 'getCurrentQuery');
            };
        });
        
        beforeEach(() => {
            helper.context.getCurrentQuery.returns(query);
            helper.component.setState({path: '/a/b'});
        });
        
        it('should set "q" query of current URL to the input form', () => {
            assert(helper.component.state.text === query.q);
        });
    });
    
    context('when submitted', () => {
        var transitionToSpy: SinonSpy;
        var searchText = 'hoge';
        var pathname = '/path/to/hoge';
        var params = {hoge: 'hoge'};
        var query = {query1: 'aa', q: 'ee'};
        var expectedQeury = {query1: 'aa', q: searchText};
        
        before(() => {
            helperCallback = (helper: MyHelper) => {
                transitionToSpy = sinon.spy(helper.context, 'transitionTo');
                sinon.stub(helper.context, 'getCurrentPathname').returns(pathname);
                sinon.stub(helper.context, 'getCurrentParams').returns(params);
                sinon.stub(helper.context, 'getCurrentQuery').returns(query);
            };
        });
        
        it('should transition to an URL added with "q" query to current URL', () => {
            helper.component.state.text = searchText;
            TestUtils.Simulate.submit(helper.component.getDOMNode());
            assert(transitionToSpy.withArgs(pathname, params, expectedQeury).calledOnce);
        });
    });
});
