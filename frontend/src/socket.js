import io from "socket.io-client";
const sockets = io("http://localhost:5000");
export default sockets;
