const express = require ("express");
const app = express();
const port = 9000;
const path = require("path"); //path module is used to get the path of the file
const http = require("http");  //http server

const socketio = require("socket.io");  //socket io runs on http server ..importing socket.io

const server = http.createServer(app); ///creating http server and we are passing express app to it and will be stored in server... now have to call socket io
const io = socketio(server); //server variable pass kar dunga .socket io is called with server ... and will store in io variable

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname,"public")));                 //public folder is created and all the static files  like image css and vanila javascript ..//

io.on("connection", (socket) => {
    socket.on("send-location", (data) => {
        io.emit("receive-location", { id: socket.id, ...data });
    });
    console.log("new connection established");

    socket.on("disconnect", () => {
        io.emit("user-disconnected", socket.id); // Corrected event name
    });
});




app.get("/",(req,res)=>{
    res.render("index");

})

server.listen(port,(req,res)=>{
    console.log("server is running on port 9000");
})