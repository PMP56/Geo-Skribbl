import React, { Component, useEffect, useState } from 'react';
import SendIcon from '@material-ui/icons/Send';

import './style/chat.css'
const socket = io();


const Chat = (props) => {
    const [roomCode, setRoomCode] = useState(props.data.code);
    const [roomStat, setRoomStat] = useState(props.data);
    const [chats, setChats] = useState([]);

    const [guessed, setGuessed] = useState(false);

    const [currentWord, setCurrentWord] = useState('');
    const username = props.user;

    useEffect(() => {
        console.log(roomStat);
        socket.emit('canvasJoin', roomCode);
        socket.on('message', message => {
            const date = new Date();
            const hour = date.getHours();
            const minute = "0" + date.getMinutes();

            let formatTime = `${hour} : ${minute.substr(-2)}`;
            setChats(prevVal => ([
                ...prevVal,
                { username: 'Bot', message: message, time: formatTime }
            ]));
            const chats = document.querySelector('.chats');
            chats.scrollTop = chats.scrollHeight;
        })
        socket.on('chat', ({ room, data }) => {
            const date = new Date();
            const hour = date.getHours();
            const minute = "0" + date.getMinutes();

            let formatTime = `${hour} : ${minute.substr(-2)}`;
            setChats(prevVal => ([
                ...prevVal,
                { username: data.user, message: data.msg, time: formatTime, correct: data.correct }
            ]));
            setRoomStat(room);
            console.log(room)
            const chats = document.querySelector('.chats');
            chats.scrollTop = chats.scrollHeight;
        })

        socket.on('turnChange', ({ room, turn }) => {
            setRoomStat(room);
            setGuessed(false);
        })

        socket.on('wordChoosen', (word) => {
            setCurrentWord(word);
        })

    }, [])


    const [msg, setMsg] = useState('');
    const textChange = (e) => {
        setMsg(e.target.value);
    }

    const submit = (e) => {
        if (msg.length != 0 && !guessed) {
            const correct = msg.toLowerCase() == currentWord.toLowerCase();
            setMsg('');
            if (correct) {
                setGuessed(true);
            }
            //console.log(correct);
            socket.emit('chat', { roomStat: roomStat, data: { user: username, code: roomCode, msg: msg, correct: correct } });
        }
        document.querySelector('.chat-input').focus();

    }
    const enter = (e) => {
        if (e.key != 'Enter') {
            return
        }
        if (msg.length != 0 && !guessed) {
            const correct = msg.toLowerCase() == currentWord.toLowerCase();
            setMsg('');
            if (correct) {
                setGuessed(true);
            }
            //console.log(correct);
            socket.emit('chat', { roomStat: roomStat, data: { user: username, code: roomCode, msg: msg, correct: correct } });
        }
        document.querySelector('.chat-input').focus();
    }

    const ChatTile = (props) => {
        //console.log(props)
        return (
            <div className='chat-tile'>
                <div className='chat-top'>
                    <h5 className='chat-header'>{props.data.username}</h5>
                    <h6 className='chat-subheader'>{props.data.time}</h6>
                </div>
                <h6 className='chat-subheader'>{props.data.message}</h6>
            </div>

        );
    }

    const CorrectTile = (props) => {
        return (
            <div className='chat-correct-tile'>
                <h6 className='chat-correct-subheader'>{`${props.data.username} guessed the word.`}</h6>
            </div>
        );
    }

    return (
        <div className='chatbox'>
            <div className='chats'>
                {
                    chats.map((user, index) =>
                        (!(user.correct)) ?
                            <ChatTile data={user} key={index} />
                            :
                            <CorrectTile data={user} key={index} />

                    )
                }
            </div>
            <div className='formbox-chat'>
                <input className='chat-input' type='text' value={msg} onChange={textChange} onKeyDown={enter} autoFocus></input>
                <SendIcon className='send-button' onClick={submit} />
            </div>
        </div>
    );
}

export default Chat;