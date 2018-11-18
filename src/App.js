import React, { Component } from 'react'
import './App.css'

class App extends Component {
  state = {
    command: '',
    speak: true,
    voices: [],
    speechRecognition: null,
    speechSynthesis: null,
    speechUtterance: null,
  }

  initSpeech() {
    this.initSpeechRecognition()
    this.initSpeechSynthesis()
  }

  initSpeechRecognition = () => {
    const { speechRecognition } = this.state

    if (!speechRecognition) {
      window.SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition
  
      const recognition = new window.SpeechRecognition()
      // recognition.interimResults = true
      recognition.lang = 'en-US'
      recognition.maxAlternatives = 1

      this.setState({
        speechRecognition: recognition
      })
    }

    this.startSpeechRecognition()
  }
  
  startSpeechRecognition = () => {
    const { speechRecognition, speechSynthesis } = this.state
    if (!speechRecognition) {
      return
    }

    speechRecognition.start()
    speechRecognition.onend = () => {
      if (speechSynthesis.speaking) {
        return
      }
      speechRecognition.start()
    }
  
    speechRecognition.onresult = e => {
      this.speechProcess(e)
    }
  }

  endSpeechRecognition = () => {
    const { speechRecognition } = this.state
    speechRecognition.stop()
  }

  initSpeechSynthesis() {
    const { speechUtterance, speechSynthesis } = this.state
    if (!speechSynthesis || !speechUtterance) {
      const newSpeechSynthesis = window.speechSynthesis
      const newSpeechUtterance = new SpeechSynthesisUtterance()
      this.setState({
        speechSynthesis: newSpeechSynthesis,
        speechUtterance: newSpeechUtterance
      })
    }
  }

  welcomeMessage() {
    // this.response('Hello, and welcome to Iris Version 1. Who am I talking to?')
    this.response('Hello?')
  }

  speechProcess = e => {
    const transcript = Array.from(e.results)
      .map(result => result[0])
      .map(result => result.transcript)
      .join('')

    if (e.results[0].isFinal) {
      this.setState({
        command: transcript
      })

      this.processCommand()
    }
  }

  processCommand = () => {
    console.log('processing command')
    const { command } = this.state

    var response = ''
    if (command === 'Iris') {
      response = 'Hello, how can I help?'
    } else {
      response = 'I am sorry, but could you say that again?'
    }

    this.response(response)
  }

  response = response => {
    const { speak, speechSynthesis, speechUtterance, voices } = this.state
    if (!speechUtterance) {
      return
    }

    if (speak) {
      speechSynthesis.cancel()
      const voiceId = this.refs['voice-selection'].value
      const voice = voices.find(voice => voice.name === voiceId)
      speechUtterance.text = response
      speechUtterance.voice = voice

      console.log('Starting speech')
      speechUtterance.onend = e => {
        console.log('Speech ended')
        this.startSpeechRecognition()
      }

      console.log('ending speech rec')
      this.endSpeechRecognition()
      console.log('SPEAKING')
      speechSynthesis.speak(speechUtterance)
    }
  }

  generateVoices = e => {
    let voices = window.speechSynthesis.getVoices() || []

    voices = voices.filter(voice => voice.lang.includes('en'))

    this.setState({
      voices
    })
  }

  componentDidMount() {
    this.initSpeech()
  }

  componentWillMount() {
    // you have to wait until voices have been loaded
    // this.generateVoices.bind(this)
    window.speechSynthesis.onvoiceschanged = () => {
      console.log('Loaded: speechSynthesis')
      this.generateVoices(this)
      this.welcomeMessage()
    }
  }

  render() {
    const { command, voices } = this.state

    // convert voices from object to array
    var voicesArray = Object.keys(voices).map(function(i) {
      return voices[i]
    })

    return (
      <div className="voice-command">
        <h1>Welcome to Ir15</h1>
        <p>Say 'Iris' to start conversation:</p>
        <div className="words">{command}</div>
        <select className="voice-selection" ref="voice-selection">
          {voicesArray.map((voice, i) => {
            return (
              <option value={voice.voiceURI} key={i}>
                {`${voice.name} (${voice.lang})`}
              </option>
            )
          })}
        </select>
        <button onClick={this.processCommand}>Test</button>
      </div>
    )
  }
}

export default App
