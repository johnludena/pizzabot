import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import '../node_modules/skeleton-css/css/skeleton.css';
// import botAvatar from './images/bot-avatar.png';

class App extends React.Component {

    constructor(props) {
        super(props);
             
        this.state = {
            userMessages: [],
            botMessages: [],
        }
    }

    componentDidMount = () => {
        fetch('https://jsonplaceholder.typicode.com/posts')
        .then((response) => {
            console.log('RESPONSE =>', response);
            return response.json();
        })
        .then((json) => {
            console.log('JSON=>', json);
            console.log(typeof json);
            var titlesArray = json.map(function(obj){
                return obj.title;
            });

            this.setState({
                botMessages: titlesArray
            })

            console.log('botMessages array on state is now:', this.state.botMessages);
        });
    }

    updateUserMessages = (newMessage ) => {

        var newStateArr = this.state.userMessages;

        this.setState({
            userMessages: newStateArr.concat(newMessage)
        })
    }

    showMessages() {

        var userConvo = this.state.userMessages;

        if (this.state.userMessages.length === 0) {
            console.log('conversation not yet started, exiting...')
            return;
        } 
        
        var updatedConvo = userConvo.map((data, index)=>{
            return (
                <div className="conversation-pair" key={'convo' + index}> 
                    <UserBubble message={data} key={'u'+index} />
                    <BotBubble message={this.state.botMessages[index]} key={'b'+index} />
                </div>
            )
        });

        return updatedConvo;
        
    }

    render() {

        return (
            <div id="app-container">
                <div className="convo-container">{this.showMessages()}</div>
                <UserInput userMessage = {this.state.userMessage} updateUserMessages = {this.updateUserMessages} />
            </div>
            
        )
    }
}

class UserBubble extends React.Component {

    render() {

        return (
            <div className="chat-bubble user">{this.props.message}</div>
        )
    }
}


class BotBubble extends React.Component {

    constructor(props) {
        super(props);

        // this.state = {
        //     visibility: "hidden"
        // }

    }

    // componentWillMount = () =>{
        
    //     setTimeout(()=>{
    //         this.setState({
    //             visibility: "show",
    //         })
    //     }, 1000)
    // }
    
    render() {

        return (
            <div className="bot-message-container">
                <div className="img-avatar-container">
                    <img className="bot-avatar" src="https://api.adorable.io/avatars/285/abott@adorable.png" alt="bot avatar" />
                </div>
                
                <div className="chat-bubble bot">{this.props.message}</div>
            </div>
        )
    }
}

class UserInput extends React.Component {

    handleChange = (event) => {

        if (event.key === 'Enter') {
            var userInput = event.target.value;

            // update state on parent component
            this.props.updateUserMessages(userInput);
            event.target.value = '';
        }
    }
    
    render() {
        return (
            <div className="input-container">
                <input id="chat" type="text" onKeyPress={this.handleChange} placeholder="type in your text to chat" />
            </div>
        )
    }
}

ReactDOM.render(<App />, document.getElementById('root'));