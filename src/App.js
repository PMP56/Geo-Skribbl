import React, { Component, Fragment } from 'react';
import { Route, BrowserRouter as Router } from 'react-router-dom';
import Home from './components/home';
import Game from './components/game';

const App = () => {
    return (
        <Router>
            <Route exact path='/' component={Home} />
            <Route path='/:code' component={Game} />
        </Router>
        // <div className='app-body'>
        //     <Canvas />
        //     <Chat />
        // </div>
    );
}

export default App;