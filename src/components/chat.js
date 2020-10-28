import React, { Component, useEffect, useState } from 'react';
import SendIcon from '@material-ui/icons/Send';

import './style/chat.css'
const socket = io();


const Chat = () => {

    const [chats, setChats] = useState([]);
    useEffect(() => {
        socket.on('message', message => {
            setChats(prevVal => ([
                ...prevVal,
                { username: 'Bot', message: message }
            ]));
        })
        socket.on('chat', chat => {
            setChats(prevVal => ([
                ...prevVal,
                { username: 'LORD', message: chat }
            ]))
            const chats = document.querySelector('.chats');
            chats.scrollTop = chats.scrollHeight;
            //users.push({ username: 'LORD', message: chat })
            // console.log(chat)
            // console.log(chats)
        })
    }, [0])


    const [msg, setMsg] = useState('');
    const textChange = (e) => {
        setMsg(e.target.value);
    }

    const submit = (e) => {
        if (msg.length != 0) {
            socket.emit('chat', msg);
            setMsg('');
        }
        document.querySelector('.chat-input').focus();

    }
    const enter = (e) => {
        if (e.key != 'Enter') {
            return
        }
        if (msg.length != 0) {
            socket.emit('chat', msg);
            setMsg('');
        }
        document.querySelector('.chat-input').focus();
    }

    const ChatTile = (props) => {
        //console.log(props)
        return (
            <div className='chat-tile'>
                <h5 className='chat-header'>{props.data.username}</h5>
                <h6 className='chat-subheader'>{props.data.message}</h6>
            </div>

        );
    }

    return (
        <div className='chatbox'>
            <div className='chats'>
                {
                    chats.map((user, index) =>
                        <ChatTile data={user} key={index} />
                    )
                }
            </div>
            <div className='formbox'>
                <input className='chat-input' type='text' value={msg} onChange={textChange} onKeyDown={enter} autoFocus></input>
                <SendIcon className='send-button' onClick={submit} />
            </div>
        </div>
    );
}

export default Chat;