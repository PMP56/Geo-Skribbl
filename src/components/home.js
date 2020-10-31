import { CircularProgress } from '@material-ui/core';
import React, { Fragment, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './style/home.css';

const socket = io();

const Home = () => {
    const [username, setUsername] = useState('');
    const [roomcode, setRoomcode] = useState('');
    const [creating, setCreating] = useState(false);
    const [expanded, setExpanded] = useState(false);
    const [genCode, setGenCode] = useState('');
    //const [roomStat, setRoomStat] = useState({});
    const [players, setPlayers] = useState([]);

    useEffect(() => {
        socket.on('join', (room) => {
            console.log(room);
            setPlayers(room);
            // Object.entries(room).forEach((player, index) => {
            //     console.log(player)
            // })

        });

        let prevname = localStorage.getItem('username');
        if (prevname != null) {
            setUsername(prevname);
        }
        let letters = document.getElementsByClassName('title-letter');
        Array.from(letters).forEach((letter) => {
            let time = Math.random() * (4 - 2) + 2;

            let random = Math.floor(Math.random() * (Math.floor(60) - Math.ceil(-90)) + Math.ceil(-90));
            let rotation1 = `${random}deg`
            let rotation2 = `${random + random / 2}deg`
            let rotation3 = `${random - random / 2}deg`
            let rotation4 = `${random}deg`

            let colors = ['red', 'blue', 'pink', 'purple', 'orange', 'cyan', 'limegreen', 'yellow', 'brown', 'darkred', 'tomato']
            let colorIndex = Math.floor(Math.random() * colors.length)

            letter.style.setProperty('--time', `${time}s`)
            letter.style.setProperty('--rotation1', rotation1)
            letter.style.setProperty('--rotation2', rotation2)
            letter.style.setProperty('--rotation3', rotation3)
            letter.style.setProperty('--rotation4', rotation4)
            letter.style.setProperty('--textcolor', colors[colorIndex])
        })
    }, []);

    const nameChange = (e) => {
        setUsername(e.target.value)
    }
    const codeChange = (e) => {
        setRoomcode(e.target.value)
    }

    const joinRoom = () => {
        socket.emit('join', { code: roomcode, user: username });
    }

    const createRoom = () => {
        if (username.length == 0) {
            window.alert('Enter an username')
            return
        }
        localStorage.setItem('username', username);
        creatingRoom();
    }

    const creatingRoom = () => {
        if (!expanded) {
            setCreating(true);
            setTimeout(() => {
                setCreating(false)
                expandForm();
                generateCode();
            }, 1000);
        } else {
            collapseForm();
        }
    }

    const generateCode = () => {
        let gen_code = '';
        let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let charactersLength = characters.length;
        for (let i = 0; i < 6; i++) {
            gen_code += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        setGenCode(gen_code);
        socket.emit('join', { code: gen_code, user: username });
    }

    const copyCode = () => {
        var copyText = document.querySelector(".code-field");
        copyText.select();
        copyText.setSelectionRange(0, 99999);
        document.execCommand("copy");
        console.log(players)
    }

    const expandForm = () => {
        let form1 = document.querySelector('.form1');
        let form2 = document.querySelector('.form2');

        form1.style.left = `${form1.offsetLeft - 200}px`;
        form2.style.left = `${form2.offsetLeft + 200}px`;
        form2.style.height = `${form1.clientHeight} px`;
        setExpanded(true);
    }

    const collapseForm = () => {
        let form1 = document.querySelector('.form1');
        let form2 = document.querySelector('.form2');
        //console.log(form2)
        form1.style.left = `${form1.offsetLeft + 200}px`;
        form2.style.left = `${form2.offsetLeft - 200}px`;
        form2.style.height = `${form1.clientHeight} px`;
        setExpanded(false);
    }


    const CircularLoading = () => {
        return (
            <CircularProgress style={{ color: 'darkred' }} className='loading' />
        )
    }

    const PlayerTile = (props) => {
        return (
            <h3>{props.data}</h3>
        );
    }

    return (
        <div className='home'>
            <div className='overlay'></div>
            <div className='title'>
                <h1 className='title-letter'>G</h1>
                <h1 className='title-letter'>E</h1>
                <h1 className='title-letter'>O</h1>
                <h1 className='title-letter'>-</h1>
                <h1 className='title-letter'>S</h1>
                <h1 className='title-letter'>K</h1>
                <h1 className='title-letter'>R</h1>
                <h1 className='title-letter'>I</h1>
                <h1 className='title-letter'>B</h1>
                <h1 className='title-letter'>B</h1>
                <h1 className='title-letter'>L</h1>
            </div>
            {(creating) ? <CircularLoading /> : <Fragment />}
            <div className='formbox'>
                <div className='form1'>
                    <img src='/doodles/3.png' className='doodle1'></img>
                    <img src='/doodles/4.png' className='doodle2'></img>
                    <div className='section'>
                        <h2 className='form-header'>Username</h2>
                        <input type='text' placeholder='Username' className='name-field' onChange={nameChange} value={username}></input>
                    </div>
                    <div className='section'>
                        <h2 className='form-header'>Room Code</h2>
                        <input type='text' placeholder='Room Code' className='name-field' onChange={codeChange}></input>
                        <h6 style={{ margin: '0px 0px 0px 20px', fontSize: '14px', fontFamily: 'monospace' }}>(Enter the room code to join a room)</h6>
                    </div>
                    <button className='join-button' disabled={(roomcode.length == 0)} onClick={joinRoom}>Join a room</button>
                    <button className='create-button' onClick={createRoom}>
                        <h4 style={{ margin: '0px', color: (!expanded) ? "white" : "red" }}>{!expanded ? 'Create a Room' : 'Delete this room'}</h4>
                    </button>
                </div>
                <div className='form2'>

                    <div className='section'>
                        <h2 className='form-header'>Room Code</h2>
                        <div className='room-form'>
                            <input type='text' placeholder='Username' className='code-field' readOnly value={genCode}></input>
                            <button className='code-copy' onClick={copyCode}>Copy</button>
                        </div>
                        <h6 style={{ margin: '0px 0px 0px 20px', fontSize: '13px', fontFamily: 'monospace' }}>(Send this code to your friends)</h6>
                    </div>
                    <div className='lobby'>
                        <h2 className='form-header'>Players:</h2>
                        <div className='player-container'>
                            {
                                players.map((name, index) =>
                                    <PlayerTile data={name} key={index} />
                                )
                            }
                        </div>
                    </div>
                    <Link to='/blabla' style={{ color: 'white', textDecoration: 'none' }}>
                        <button className='start-button'>
                            Start
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default Home;