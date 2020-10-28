import React, { Component, Fragment } from 'react';
import Canvas from './components/canvas/canvas';
import Chat from './components/chat';

import './App.css';

const App = () => {
    return (
        <div className='app-body'>
            <Canvas />
            <Chat />
        </div>
    );
}

export default App;