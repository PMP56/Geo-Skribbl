import React, { Fragment } from 'react';
import Canvas from './canvas';
import Chat from './chat';

import './style/game.css';

const Game = (props) => {
    return (
        <div className='app-body'>
            <Canvas user={props.user} data={props.data} />
            <Chat user={props.user} data={props.data} />
        </div>
    );
}

export default Game;
