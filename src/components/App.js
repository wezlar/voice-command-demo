import React from 'react'

class App extends React.Component {
    state = {
        command: '',
        speak: true,
        voices: [],
        speechUtterance: null,
    }

    initSpeech () {
        this.initSpeechRecognition()
        this.initSpeechUtterance()
    }
    
    initSpeechRecognition () {
        window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    
        const recognition = new window.SpeechRecognition()
        recognition.interimResults = true
        recognition.lang = 'en-US'
        
        let p = document.createElement('p')
        const words = document.querySelector('.words')
        words.appendChild(p)
    
        recognition.addEventListener('result', (e) => { 
            this.speechProcess(e) 
        })
        recognition.addEventListener('end', recognition.start)
        recognition.start()
    }

    initSpeechUtterance () {
        const { speechUtterance } = this.state
        if (!speechUtterance) {
            var newSpeechUtterance = new SpeechSynthesisUtterance()
            this.setState({
                speechUtterance: newSpeechUtterance
            })
        }
    }

    welcomeMessage() {
        this.response('Hello, and welcome to Iris Version 1. Who am I talking to?')
    }

    speechProcess = (e) => {
        console.log('Speech process')

        const transcript = Array.from(e.results)
            .map(result => result[0])
            .map(result => result.transcript)
            .join('')
    
        if (e.results[0].isFinal) {
            console.log('Final')
            console.log(transcript)
            
            this.setState({
                command: transcript
            })

            this.processCommand()
        }
    }

    processCommand = () => {
        console.log('process command')
        const { command } = this.state
        
        var response = ''
        if (command === 'Iris') {
            response = 'Hello, how can I help?'
        } else {
            response = 'I am sorry, but could you say that again?'
        }

        console.log(response)
        this.response(response)
    }

    response = (response) => {
        const { speak, speechUtterance, voices } = this.state
        
        if (speak) {
            window.speechSynthesis.cancel()
            const voiceId = this.refs['voice-selection'].value
            const voice = voices.find(voice => voice.name === voiceId);
            speechUtterance.text = response
            speechUtterance.voice = voice

            window.speechSynthesis.speak(speechUtterance)

        }
    }

    generateVoices = (e) => {
        let voices = window.speechSynthesis.getVoices() || []

        voices = voices.filter(voice => voice.lang.includes('en'))
    
        this.setState({
            voices 
        })
    }

    componentDidMount () {
        this.initSpeech()
    }

    componentWillMount () {
        // you have to wait until voices have been loaded
        // this.generateVoices.bind(this)
        window.speechSynthesis.onvoiceschanged = () => {
            console.log('Loaded: speechSynthesis')
            this.generateVoices(this)
            this.welcomeMessage()
        };
    }

    render () {
        const { command, voices } = this.state

        // convert voices from object to array
        var voicesArray = Object.keys(voices).map(function (i) {
            return voices[i];
        });

        return (
            <div className="voice-command">
                <h1>Welcome to Ir15</h1>
                <p>Say 'Iris' to start conversation:</p>
                <div className="words">{ command }</div>
                <select className="voice-selection" ref="voice-selection">
                { voicesArray.map((voice, i) => {
                    return (
                    <option value={voice.voiceURI}
                        key={i}>
                        { `${voice.name} (${voice.lang})` }
                    </option>
                    )
                })}
                </select>
                <button onClick={this.processCommand}>
                    Test
                </button>
            </div>
        )
    }
}

export default App