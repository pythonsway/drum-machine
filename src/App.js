import React from 'react';
import './App.css';

const drumSamples = [{
  keyCode: 81,
  keyTrigger: 'Q',
  id: 'Heater-1',
  url: 'https://s3.amazonaws.com/freecodecamp/drums/Heater-1.mp3'
}, {
  keyCode: 87,
  keyTrigger: 'W',
  id: 'Heater-2',
  url: 'https://s3.amazonaws.com/freecodecamp/drums/Heater-2.mp3'
}, {
  keyCode: 69,
  keyTrigger: 'E',
  id: 'Heater-3',
  url: 'https://s3.amazonaws.com/freecodecamp/drums/Heater-3.mp3'
}, {
  keyCode: 65,
  keyTrigger: 'A',
  id: 'Heater-4',
  url: 'https://s3.amazonaws.com/freecodecamp/drums/Heater-4_1.mp3'
}, {
  keyCode: 83,
  keyTrigger: 'S',
  id: 'Clap',
  url: 'https://s3.amazonaws.com/freecodecamp/drums/Heater-6.mp3'
}, {
  keyCode: 68,
  keyTrigger: 'D',
  id: 'Open-HH',
  url: 'https://s3.amazonaws.com/freecodecamp/drums/Dsc_Oh.mp3'
}, {
  keyCode: 90,
  keyTrigger: 'Z',
  id: "Kick-n'-Hat",
  url: 'https://s3.amazonaws.com/freecodecamp/drums/Kick_n_Hat.mp3'
}, {
  keyCode: 88,
  keyTrigger: 'X',
  id: 'Kick',
  url: 'https://s3.amazonaws.com/freecodecamp/drums/RP4_KICK_1.mp3'
}, {
  keyCode: 67,
  keyTrigger: 'C',
  id: 'Closed-HH',
  url: 'https://s3.amazonaws.com/freecodecamp/drums/Cev_H2.mp3'
},
];

class DrumPad extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      padActive: false
    }
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.activatePad = this.activatePad.bind(this);
    this.playSound = this.playSound.bind(this);
  }
  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyPress);
  }
  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyPress);
  }
  handleKeyPress(e) {
    if (e.keyCode === this.props.keyCode) {
      this.playSound();
    }
  }
  activatePad() {
    this.setState({
      padActive: !this.state.padActive
    })
  }
  playSound() {
    const sound = document.getElementById(this.props.keyTrigger);
    sound.currentTime = 0;
    sound.play();
    this.activatePad();
    setTimeout(() => this.activatePad(), 100);
    this.props.updateDisplay(this.props.clipId.replace(/-/g, ' '));
  }
  render() {
    return (
      <div id={this.props.clipId}
        onClick={this.playSound}
        className={this.state.padActive ? "drum-pad activePad" : "drum-pad inactivePad"}
        style={this.props.power ? { pointerEvents: 'auto' } : { pointerEvents: 'none' }} >
        <audio className='clip' id={this.props.keyTrigger} src={this.props.clip}></audio>
        {this.props.keyTrigger}
      </div>
    )
  }
}

class PadBank extends React.Component {
  render() {
    return (
      <div className="pad-bank" >
        {drumSamples.map((drumObj, i, padBankArr) => {
          return (
            <DrumPad
              clipId={padBankArr[i].id}
              clip={this.props.power ? padBankArr[i].url : "#"}
              keyTrigger={padBankArr[i].keyTrigger}
              keyCode={padBankArr[i].keyCode}
              updateDisplay={this.props.updateDisplay}
              power={this.props.power} />
          )
        })}
      </div>
    )
  }
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      power: true,
      display: String.fromCharCode(160),
      sliderVal: 0.4
    }
    this.displayClipName = this.displayClipName.bind(this);
    this.adjustVolume = this.adjustVolume.bind(this);
    this.powerControl = this.powerControl.bind(this);
    this.clearDisplay = this.clearDisplay.bind(this);
  }
  powerControl() {
    this.setState({
      power: !this.state.power,
      display: String.fromCharCode(160)
    });
  }
  displayClipName(name) {
    if (this.state.power) {
      this.setState({
        display: name
      });
    }
  }
  adjustVolume(e) {
    if (this.state.power) {
      this.setState({
        sliderVal: e.target.value,
        display: "Volume: " + Math.round(e.target.value * 100)
      });
      setTimeout(() => this.clearDisplay(), 2000);
    }
  }
  clearDisplay() {
    this.setState({
      display: String.fromCharCode(160)
    });
  }
  render() {
    const clips = [].slice.call(document.querySelectorAll('.clip'));
    clips.forEach(sound => {
      sound.volume = this.state.sliderVal
    });
    return (
      <div className="container" id="drum-machine">
        <div className="logo">Drum Machine</div>
        <div id="display">
          <p>{this.state.display}</p>
        </div>
        <PadBank
          power={this.state.power}
          updateDisplay={this.displayClipName}
          clipVolume={this.state.sliderVal} />
        <div className="controls">
          <div className="power">
            <p>OFF - ON</p>
            <div onClick={this.powerControl} className="select">
              <div style={this.state.power ? { float: 'right' } : { float: 'left' }}
                className="inner">
              </div>
            </div>
          </div>
          <div className="volume">
            <p>Volume</p>
            <input type="range" min="0" max="1" step="0.01" value={this.state.sliderVal}
              className="slider"
              onChange={this.adjustVolume} />
          </div>
        </div>
      </div>
    )
  }
}

export default App;
