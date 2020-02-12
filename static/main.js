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
        sendMessage() {
            if (this.validateInput()) {
                const message = {
                    name: this.name,
                    text: this.text
                }
                this.socket.emit('msgToServer', message)
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
            // 'query': 'token=' + 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImRiZjJjMTUwLWY1N2UtNDY4NC1hYjAyLTM0MmJhMThmMzBkNCIsImlhdCI6MTU4MTQyNzY0Nn0.MbdzMWArNFJfSC5DU9mYx_j5ZxZVA1-PyZY6M9glGgc'
            'query': 'token=' + 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjExNDg4NjUwLTFkYmItNGE3NS1hMDY3LWQwMGJmMjUwMzI3ZiIsImlhdCI6MTU4MTQzNDYyNX0.VVLNL_0zqHsY3sop3mtguLx3ixUrJxiFCRpFt1o3-O0'

        });
        this.socket.on('msgToClient', (message) => {
            this.receivedMessage(message)
        })
    }
});
