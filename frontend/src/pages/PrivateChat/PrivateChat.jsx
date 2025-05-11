import React, { useState } from 'react';
import styles from './PrivateChat.module.css';

const PrivateChat = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');

    const handleSend = () => {
        if (!input.trim()) return;
        const newMessage = { text: input, sender: true };
        setMessages((prev) => [...prev, newMessage]);
        setInput('');
    };

    return (
        <div className={styles['chat-container']}>
            <h2 className={styles['chat-header']}>Czat Prywatny</h2>
            <div className={styles['chat-box']}>
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className={`${styles['chat-message']} ${msg.sender ? styles.sender : styles.receiver}`}
                    >
                        {msg.text}
                    </div>
                ))}
            </div>
            <div className={styles['chat-input-container']}>
                <input
                    type="text"
                    className={styles['chat-input']}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Napisz wiadomość..."
                />
                <button className={styles['chat-send-button']} onClick={handleSend}>
                    Wyślij
                </button>
            </div>
        </div>
    );
};

export default PrivateChat;
