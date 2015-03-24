import React = require("react");
import Router = require("react-router");
import AppComponent = require("./components/app_component");
import HomeComponent = require("./components/home_component");

import Route = Router.Route;
import DefaultRoute = Router.DefaultRoute;
import App = AppComponent.Component;
import Home = HomeComponent.Component;

class Routes {
    root: Route = React.jsx(`
        <Route name="root" path="/" handler={App}>
            <DefaultRoute handler={Home} />
            <Route name="tag_entries" path="/tags/:name/entries" handler={Home} />
        </Route>
    `);
}

export = Routes;
