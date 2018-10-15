import React from 'react'

class App extends React.Component {
    state = {
        command: ''
    }

    componentDidMount () {
        window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition

        const recognition = new window.SpeechRecognition()
        recognition.interimResults = true

        recognition.lang = 'en-US'

        let p = document.createElement('p')
        const words = document.querySelector('.words')
        words.appendChild(p)

        recognition.addEventListener('result', e => {
            const transcript = Array.from(e.results)
                .map(result => result[0])
                .map(result => result.transcript)
                .join('')

            this.setState({
                command: transcript
            })

            if (e.results[0].isFinal) {
                p = document.createElement('p')
                words.appendChild(p)
            }
        })

        recognition.addEventListener('end', recognition.start)

        recognition.start()
    }
    render () {
        return (
            <div className="voice-command">
                <h1>Welcome to Ir15</h1>
                <p>Talk, what you have said will appear below:</p>
                <div className="words">{this.state.command}</div>
            </div>
        )
    }
}

export default App