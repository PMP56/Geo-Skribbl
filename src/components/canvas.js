import React, { Component, useState, useEffect, useRef, Fragment } from 'react';

import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';

import "./style/canvas.css";
const socket = io();

const Canvas = (props) => {
    const canvasRef = useRef(null)
    const context = useRef(null)
    const [roomCode, setRoomCode] = useState(props.data.code);
    const [roomStat, setRoomStat] = useState(props.data);
    const [isDrawing, setIsDrawing] = useState(false);
    const [brushColor, setBrushColor] = useState("black");
    const [brushWidth, setBrushWidth] = useState(5);

    useEffect(() => {
        console.log(roomCode);
        const canvas = canvasRef.current;
        canvas.width = canvas.parentElement.clientWidth;
        canvas.height = 7 * window.innerHeight / 10;
        canvas.style.width = `${canvas.parentElement.clientWidth} px`;
        canvas.style.height = `${7 * window.innerHeight / 10}px`;
        const contextRef = canvas.getContext('2d');
        contextRef.lineCap = "round";
        contextRef.strokeStyle = brushColor;
        contextRef.lineWidth = brushWidth;
        context.current = contextRef;

    }, [context]);


    //socket.emit('get', roomCode);
    useEffect(() => {
        socket.emit('canvasJoin', roomCode);

        socket.on('mouseDown', (data) => {
            //console.log(data);
            const x = data.offsetx;
            const y = data.offsety;
            context.current.beginPath();
            // context.current.moveTo(x - 70, y - 5);
        })

        socket.on('mouseUp', (message) => {
            //console.log('UP');
            context.current.closePath();
            //console.log(isDrawing);
        })

        socket.on('mouseMove', (data) => {
            //console.log('move')
            const x = data.offsetx;
            const y = data.offsety;
            context.current.strokeStyle = data.color;
            context.current.lineWidth = data.width;
            context.current.lineTo(x, y);
            context.current.stroke();
        })

        socket.on('clear', () => {
            context.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        })
    }, [0])

    const mouseDown = ({ nativeEvent }) => {
        const x = nativeEvent.offsetX;
        const y = nativeEvent.offsetY;
        setIsDrawing(true);
        socket.emit('mouseDown', { code: roomCode, data: { offsetx: x, offsety: y, color: brushColor, width: brushWidth } })
    }

    const mouseMove = ({ nativeEvent }) => {
        const x = nativeEvent.offsetX;
        const y = nativeEvent.offsetY;
        if (isDrawing) {
            socket.emit('mouseMove', { code: roomCode, data: { offsetx: x, offsety: y, color: brushColor, width: brushWidth } })
        }
    }

    const mouseUp = (e) => {
        e.preventDefault();
        setIsDrawing(false);
        socket.emit('mouseUp', roomCode);
        //console.log('up')
    }

    const clearCanvas = () => {
        socket.emit('clear');
    }

    return (
        <div className='canvas-body'>
            <div className="toolbox">
                <div className="toolbox-icon" onClick={clearCanvas}>
                    <HighlightOffIcon style={{ cursor: 'pointer', fontSize: '36px' }}></HighlightOffIcon>
                </div>
                <div className="color-container">
                    <div className='color-row'>
                        <div className="colorBox" style={{ backgroundColor: 'black', border: (brushColor !== 'black') ? '3px solid white' : '3px solid black' }} onClick={() => { setBrushColor('black') }}></div>
                        <div className="colorBox" style={{ backgroundColor: 'red', border: (brushColor !== 'red') ? '3px solid white' : '3px solid black' }} onClick={() => { setBrushColor('red') }}></div>

                    </div>
                    <div className='color-row'>
                        <div className="colorBox" style={{ backgroundColor: 'blue', border: (brushColor !== 'blue') ? '3px solid white' : '3px solid black' }} onClick={() => { setBrushColor('blue') }}></div>
                        <div className="colorBox" style={{ backgroundColor: 'cyan', border: (brushColor !== 'cyan') ? '3px solid white' : '3px solid black' }} onClick={() => { setBrushColor('cyan') }}></div>

                    </div>
                    <div className='color-row'>
                        <div className="colorBox" style={{ backgroundColor: 'green', border: (brushColor !== 'green') ? '3px solid white' : '3px solid black' }} onClick={() => { setBrushColor('green') }}></div>
                        <div className="colorBox" style={{ backgroundColor: 'lime', border: (brushColor !== 'lime') ? '3px solid white' : '3px solid black' }} onClick={() => { setBrushColor('lime') }}></div>

                    </div>
                    <div className='color-row'>
                        <div className="colorBox" style={{ backgroundColor: 'yellow', border: (brushColor !== 'yellow') ? '3px solid white' : '3px solid black' }} onClick={() => { setBrushColor('yellow') }}></div>
                        <div className="colorBox" style={{ backgroundColor: 'brown', border: (brushColor !== 'brown') ? '3px solid white' : '3px solid black' }} onClick={() => { setBrushColor('brown') }}></div>

                    </div>
                    {/* <div className="colorBox" style={{ backgroundColor: 'white', borderBottom: (brushColor !== 'white') ? '4px solid white' : '4px solid black' }} onClick={() => { setBrushColor('white') }}></div> */}
                </div>
                <div className="size-container">
                    <div className="sizeBox" onClick={() => setBrushWidth(10)} ><FiberManualRecordIcon style={{ fontSize: '10px' }} className="size" /></div>
                    <div className="sizeBox" onClick={() => setBrushWidth(20)} ><FiberManualRecordIcon style={{ fontSize: '20px' }} className="size" /></div>
                    <div className="sizeBox" onClick={() => setBrushWidth(30)} ><FiberManualRecordIcon style={{ fontSize: '30px' }} className="size" /></div>
                    <div className="sizeBox" onClick={() => setBrushWidth(40)} ><FiberManualRecordIcon style={{ fontSize: '40px' }} className="size" /></div>
                    <div className="sizeBox" onClick={() => setBrushWidth(50)} ><FiberManualRecordIcon style={{ fontSize: '50px' }} className="size" /></div>
                </div>
            </div>
            <div className='canvas-container'>
                <canvas id="canvas" ref={canvasRef} onMouseDown={mouseDown} onMouseMove={mouseMove} onMouseUp={mouseUp}></canvas>
            </div>
        </div>
    );
}

export default Canvas;