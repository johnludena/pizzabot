import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import '../node_modules/skeleton-css/css/skeleton.css';

class App extends React.Component {

    constructor(props) {
        super(props);
             
        this.state = {
            userMessages: [],
            botMessages: ["hello there", "nice to meet you", "my name is pizzabot"],
        }
    }

    updateUserMessages = (newMessage ) => {

        var newStateArr = this.state.userMessages;

        this.setState({
            userMessages: newStateArr.concat(newMessage)
        })
    }

    showUserMessages() {

        var userConvo = this.state.userMessages;

        if (this.state.userMessages.length === 0) {
            console.log('conversation not yet started, exiting...')
            return;
        } 
        
        var updatedConvo = userConvo.map((data, index)=>{
            return <UserBubble message={data} key={index} />
        });

        return updatedConvo;
        
    }

    render() {

        return (
            <div id="app-container">
                <h1>ChatBot</h1>
                {this.showUserMessages()}
                <UserInput userMessage = {this.state.userMessage} updateUserMessages = {this.updateUserMessages} />
            </div>
            
        )
    }
}

class UserBubble extends React.Component {

    render() {

        console.log('UserBubble component...');
        return (
            <div className="chat-bubble">{this.props.message}</div>
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
            <input id="chat" type="text" onKeyPress={this.handleChange} placeholder="type in your text to chat" />
        )
    }
}

ReactDOM.render(<App />, document.getElementById('root'));