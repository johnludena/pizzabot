import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
// import '../node_modules/skeleton-css/css/skeleton.css';
import pizzaAnimation from './images/pizza-3-final.gif';
// import botAvatar from './images/bot-avatar.png';

class App extends React.Component {

    constructor(props) {
        super(props);
             
        this.state = {
            userMessages: [],
            botMessages: [],
            botGreeting: 'Hi there! My name is PizzaBot. I can help you get pizza! You can say something like \'I want a pepperoni pizza delivered to 12345 Main Ave.\' Try it below!',
            botLoading: false,
        }
    }


    updateUserMessages = (newMessage) => {

        // Create a new array from current user messages
        var updatedUserMessagesArr = this.state.userMessages;

        // Create a new array from current bot messages
        var updatedBotMessagesArr = this.state.botMessages;

        // Render user message and bot's loading message
        this.setState({
            userMessages: updatedUserMessagesArr.concat(newMessage),
            botLoading: true,
        })

        // Get the request to DialogFlow in a nice little package with the user's message
        var request = new Request('https://api.dialogflow.com/v1/query?v=20150910&contexts=shop&lang=en&query=' + newMessage + '&sessionId=12345', {
            headers: new Headers({
                "Authorization": "Bearer 4aae918f5eaf4ed4af292471a2852af4"
            })
        });

        // Send the request via fetch
        fetch(request)
        .then(response => response.json())
        .then(json => {
            console.log('BOT RESPONSE:', json.result.fulfillment.speech);

            // End conversation once user hits end flag in API
            var endConvoFlag = json.result.metadata.endConversation;
            if (endConvoFlag !== undefined || endConvoFlag === true) {
                console.log('end of conversation. order placed.')
            }

            var botResponse = json.result.fulfillment.speech;

            // Update state with both user and bot's latest messages
            this.setState({
                botMessages: updatedBotMessagesArr.concat(botResponse),
                botLoading: false,
            })

            
        })
        .catch(function(error) { 
            console.log ('ERROR =>', error);
        });
    }

    showMessages() {

        var userConvo = this.state.userMessages;

        // Show initial bot welcome message
        if (this.state.userMessages.length === 0) {
            return 
        }
        
        var updatedConvo = userConvo.map((data, index)=>{

            var botResponse = this.state.botMessages[index];
            
            return (
                <div className="conversation-pair" key={'convo' + index}> 
                    <UserBubble message={data} key={'u'+index} />
                    <BotBubble message={botResponse} key={'b'+index} />
                </div>
            )
        });

        return updatedConvo;
        
    }

    render() {

        return (
            <div id="app-container">
               
                <div className="convo-container">
                    <BotBubble message={this.state.botGreeting} key="bot-00" />
                    {this.showMessages()}
                </div>
                <UserInput userMessage = {this.state.userMessage} updateUserMessages = {this.updateUserMessages} />
            </div>
            
        )
    }
}

class UserBubble extends React.Component {

    render() {

        return (
            <div className="user-message-container">
                <div className="chat-bubble user">{this.props.message}</div>
            </div>
        )
    }
}


class BotBubble extends React.Component {

    componentDidMount = () => {

        var lastBubble = this.refs.chatBubble;
        lastBubble.scrollIntoView(true);
    }

    getTimeStamp = () => {
        var time = new Date(); // create a new Date object
        
        // Format date in 12 hour format (AM/PM) using 'toLocaleString'
        var formattedDate = time.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });

        return formattedDate;
    }

    render() {

        return (
            <div className="bot-message-container">
                <div className="img-avatar-container">
                    <img className="bot-avatar" src="https://api.adorable.io/avatars/285/abott@adorable.png" alt="bot avatar" />
                </div>
                <div>
                    <div className="chat-bubble bot" ref="chatBubble">{this.props.message ? this.props.message : '...'}</div>
                    <div className="time-stamp">{this.getTimeStamp()}</div>
                </div>
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