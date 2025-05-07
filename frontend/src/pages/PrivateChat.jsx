// PrivateChat.jsx
import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';

const chatStyles = {
    container: {
        backgroundColor: '#0d0d0d',
        minHeight: '100vh',
        padding: '20px',
        color: 'white',
        fontFamily: 'monospace',
        display: 'flex',
        flexDirection: 'column',
    },
    header: {
        color: '#ff0000',
        fontSize: '28px',
        marginBottom: '20px',
        textAlign: 'center',
    },
    chatBox: {
        flex: 1,
        backgroundColor: '#1a1a1a',
        border: '1px solid #ff0000',
        borderRadius: '8px',
        padding: '20px',
        overflowY: 'auto',
        marginBottom: '20px',
        boxShadow: '0 0 10px #ff0000',
    },
    message: {
        marginBottom: '15px',
        padding: '10px',
        borderRadius: '6px',
        maxWidth: '70%',
        wordWrap: 'break-word',
    },
    sender: {
        backgroundColor: '#ff0000',
        alignSelf: 'flex-end',
        textAlign: 'right',
    },
    receiver: {
        backgroundColor: '#333',
        alignSelf: 'flex-start',
        textAlign: 'left',
    },
    inputContainer: {
        display: 'flex',
        alignItems: 'center',
    },
    input: {
        flex: 1,
        padding: '10px',
        backgroundColor: '#1a1a1a',
        border: '1px solid #ff0000',
        borderRadius: '4px',
        color: 'white',
        marginRight: '10px',
    },
    sendButton: {
        backgroundColor: '#ff0000',
        border: 'none',
        padding: '10px 20px',
        borderRadius: '4px',
        color: 'white',
        fontWeight: 'bold',
        cursor: 'pointer',
    },
};

const PrivateChat = () => {
    const [messages, setMessages] = useState([
        { text: 'Hej! Jak się masz?', sender: 'receiver' },
        { text: 'Dobrze! A Ty?', sender: 'sender' },
    ]);
    const [newMessage, setNewMessage] = useState('');

    const handleSend = () => {
        if (newMessage.trim() !== '') {
            setMessages([...messages, { text: newMessage, sender: 'sender' }]);
            setNewMessage('');
        }
    };

    return (
        <div style={chatStyles.container}>
            <div style={chatStyles.header}>Prywatny Czat</div>

            <div style={chatStyles.chatBox}>
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        style={{
                            ...chatStyles.message,
                            ...(msg.sender === 'sender'
                                ? chatStyles.sender
                                : chatStyles.receiver),
                        }}
                    >
                        {msg.text}
                    </div>
                ))}
            </div>

            <div style={chatStyles.inputContainer}>
                <input
                    type="text"
                    placeholder="Napisz wiadomość..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    style={chatStyles.input}
                />
                <button onClick={handleSend} style={chatStyles.sendButton}>
                    Wyślij
                </button>
            </div>
        </div>
    );
};

export default PrivateChat;
