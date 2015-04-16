import React = require("react");
import Router = require("react-router");
import AppComponent = require("./components/app_component");
import HomeComponent = require("./components/home_component");
import TagListComponent = require("./components/tag_list_component");

import Route = Router.Route;
import DefaultRoute = Router.DefaultRoute;
import App = AppComponent.Component;
import Home = HomeComponent.Component;
import TagList = TagListComponent.Component;

class Routes {
    root: Route = React.jsx(`
        <Route name="root" path="/" handler={App}>
            <DefaultRoute handler={Home} />
            <Route name="tag" path="/tags" handler={TagList} />
            <Route name="tag_entries" path="/tags/:name/entries" handler={Home} />
            <Route name="mylist_entries" path="/mylists/:group_id/entries" handler={Home} />
        </Route>
    `);
}

export = Routes;
