import React, { Fragment } from 'react';
import Canvas from './canvas';
import Chat from './chat';

import './style/game.css';

const Game = (props) => {
    return (
        <div className='app-body'>
            <Canvas data={props.location.state} />
            <Chat data={props.location.state} />
        </div>
    );
}

export default Game;
