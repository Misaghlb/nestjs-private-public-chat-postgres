const app = new Vue({
    el: '#app',
    data: {
        title: 'Nestjs Websockets Chat',
        name: '',
        text: '',
        messages: [],
        socket: null
    },
    methods: {
        createPublcRoom() {
            const message = {
                name: this.name,
            };
            this.socket.emit('createNewPublicRoom', message);
            this.text = ''
        },
        joinPublicRoom() {
            const message = {
                name: 'room1',
            };
            this.socket.emit('joinPublicRoom', message);
            this.text = ''
        },
        sendMessage() {
            if (this.validateInput()) {
                const message = {
                    room_name: 'room1',
                    text: this.text
                };
                this.socket.emit('msgToRoomServer', message);
                this.text = ''
            }
        },
        sendMessagePM() {
            if (this.validateInput()) {
                const message = {
                    text: this.text,
                    receiver: "38856fc3-586b-4aca-97dd-9d13fc0c7580"
                };
                this.socket.emit('msgPrivateToServer', message);
                this.text = ''
            }
        },
        receivedMessage(message) {
            this.messages.push(message)
        },
        validateInput() {
            return this.name.length > 0 && this.text.length > 0
        }
    },
    created() {
        this.socket = io('http://localhost:3000', {
            // 'query': 'token=' + 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjM4ODU2ZmMzLTU4NmItNGFjYS05N2RkLTlkMTNmYzBjNzU4MCIsImlhdCI6MTU4MTYxODI3Nn0.zvHEzdSYrs_VpCCiFA37fBOkafpC1lI-axOhkcfpmxw'
            'query': 'token=' + 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjE2ZDUxMzM5LWJjZTctNDQ1Mi1hY2E0LTdmMzUyMjEyNWM5MSIsImlhdCI6MTU4MTYxODMxMH0.K4D4FSODoRrmT6NQnh8d9XzhBhtDudestY98SRe62lA'

        });
        this.socket.on('connect', (message) => {
            // this.receivedMessage(message)
            console.log(message);
            console.log('connected');
        });
        this.socket.on('msgToClient', (message) => {
            this.receivedMessage(message)
        });

        this.socket.on('msgPrivateToClient', (message) => {
            this.receivedMessage(message)
        });

        this.socket.on('createdNewPublicRoom', (message) => {
            console.log(message);
        });
        this.socket.on('msgToRoomClient', (message) => {
            console.log(message);
            this.receivedMessage(message);
        });
        this.socket.on('userJoined', (message) => {
            console.log(message);
            this.receivedMessage(message);
        });
    }
});
