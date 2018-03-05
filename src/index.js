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

    updateUserMessages = (newMessage ) => {

        // Create a new array from current user messages
        var updatedUserMessagesArr = this.state.userMessages;

        // Create a new array from current bot messages
        var updatedBotMessagesArr = this.state.botMessages;

        // Get the request to DialogFlow in a nice little package with the user's message
        var request = new Request('https://api.dialogflow.com/v1/query?v=20150910&contexts=shop&lang=en&query=' + newMessage + '&sessionId=12345', {
            headers: new Headers({
                "Authorization": "Bearer a38639f6a5a94fbbb1ef697e95a3d615"
            })
        });

        // Send the request via fetch
        fetch(request)
        .then(response => response.json())
        .then(json => {
            // console.log('BOT RESPONSE:', json.result.fulfillment.speech);

            var botResponse = json.result.fulfillment.speech;

            // Update state with both user and bot's latest messages
            this.setState({
                userMessages: updatedUserMessagesArr.concat(newMessage),
                botMessages: updatedBotMessagesArr.concat(botResponse)
            })
        })
        .catch(function(error) { 
            console.log ('ERROR =>', error);
        });
    }

    showMessages() {

        var userConvo = this.state.userMessages;

        // Exit function and stop rendering if user messages equals 0
        if (this.state.userMessages.length === 0) {
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
    }

    scrollToBottom = () => {

        // Scroll to bottom of container automatically
        var convoContainer = document.querySelector('.convo-container');

         var newHeight = convoContainer.scrollHeight + 500;

         convoContainer.scrollTop = newHeight;

        console.log('convoContainer.scrollHeight =>', convoContainer.scrollHeight);
        console.log('convoContainer.scrollHeight =>', newHeight);

    }

    render() {

        return (
            <div className="bot-message-container">
                <div className="img-avatar-container">
                    <img className="bot-avatar" src="https://api.adorable.io/avatars/285/abott@adorable.png" alt="bot avatar" />
                </div>
                
                <div className="chat-bubble bot">{this.props.message}</div>
                {this.scrollToBottom()}
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