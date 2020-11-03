import React, { Component, Fragment } from 'react';
import { Route, BrowserRouter as Router } from 'react-router-dom';
import Home from './components/home';

import regeneratorRuntime from "regenerator-runtime";

const App = () => {
    return (
        <Router>
            <Route exact path='/' component={Home} />
        </Router>
    );
}

export default App;