import socketIOClient from "socket.io-client";

class socketIO {
    constructor(props) {
        super(props);
        this.state = 
        {
            endpoint: "http://localhost:4001",
            socket: socketIOClient(props.endpoint)           
        };
    }

    sendMessage(target, string, ...args)
    {
        if(target == null)
            socket.emit(string, args);
        
    }

}