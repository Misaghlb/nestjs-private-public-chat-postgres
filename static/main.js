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
        sendMessagePM() {
            if (this.validateInput()) {
                const message = {
                    text: this.text,
                    receiver: "abe95179-2ffb-4fd4-bbfa-e69e08e4e450"
                };
                this.socket.emit('msgToServer', message);
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
            // 'query': 'token=' + 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImM4YmFjMjBhLWQxMDMtNDM5Yi1iZWEwLWYwZjMxMjlkZDJhZCIsImlhdCI6MTU4MTUxNjE5MX0.n_bZ2nBjgAq2SjJ-lCr-wkOKkG_8ku4yXsIzbB8ohDA'
            'query': 'token=' + 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImFiZTk1MTc5LTJmZmItNGZkNC1iYmZhLWU2OWUwOGU0ZTQ1MCIsImlhdCI6MTU4MTUxNjIzNn0.1jh05-cPk1OqwWkrGWeD164o7jF0gijoOsmaSGh76MI'

        });
        this.socket.on('msgToClient', (message) => {
            this.receivedMessage(message)
        })
    }
});
