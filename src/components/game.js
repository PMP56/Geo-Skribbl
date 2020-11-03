import React, { Fragment, useEffect, useState } from 'react';
import Canvas from './canvas';
import Chat from './chat';

import './style/game.css';

const Game = (props) => {
    const [words, setWords] = useState([]);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        fetch('/words').then(async (res) => {
            const json = await res.json();
            setWords(json.words.split(', '));
            //generateRandomWords();
            setLoaded(true);
            //checkTurn();
        })
    }, [])


    return (
        <Fragment>
            {
                (!loaded) ? <Fragment /> :
                    <div className='app-body'>
                        <Canvas user={props.user} data={props.data} words={words} />
                        <Chat user={props.user} data={props.data} />
                    </div>
            }
        </Fragment>
    );
}

export default Game;
