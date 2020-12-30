# Geo-Skribbl
An approach to REXKET (React-Express-Socket.IO)

## WOrking Site at:
http://geo-skribbl.herokuapp.com

Pull Docker image: 
```
docker pull lordmani/geo-skribbl:latest
```

Uses Socket.IO for real-time duplex communication.

### Features:
* Realtime chat
* Realtime canvas drawing
* Private rooms and codes

Also, React is configured from scratch to run along with Express on the same port (5050). 

Creating and joining a room:
![alt text](https://github.com/PMP56/Geo-Skribbl/blob/master/joining-room.gif)

Four different windows at a same time (Drawing):
![alt text](https://github.com/PMP56/Geo-Skribbl/blob/master/geo-skrribl.gif)

### Similar to skribbl.io but for geographical terms.

Clone the repo and run the following command to get started:
```js
npm run express //for production
npm run wexpress //for development
```

Run within docker container
```js
docker-compose up
```