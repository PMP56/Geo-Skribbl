import React, { Fragment } from 'react';
import Canvas from './canvas';
import Chat from './chat';

import './style/game.css';

const Game = () => {
    return (
        <div className='app-body'>
            <Canvas />
            <Chat />
        </div>
    );
}

export default Game;
