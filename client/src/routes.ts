import React = require("react");
import Router = require("react-router");
import AppComponent = require("./components/app_component");
import HomeComponent = require("./components/home_component");
import Route = Router.Route;
import DefaultRoute = Router.DefaultRoute;

class Routes {
    root: Route;
    
    constructor() {
        this.root = React.jsx(`
            <Route handler={AppComponent.Component} name="root" path="/">
                <DefaultRoute handler={HomeComponent.Component} />
            </Route>
        `);
    }
};

export = Routes;
