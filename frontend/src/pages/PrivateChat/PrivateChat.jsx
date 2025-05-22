import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const ChatRoom = () => {
  const { receiver } = useParams(); // <- pobiera z adresu URL
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("access_token");

  const username = localStorage.getItem("username");

  const fetchMessages = async () => {
    if (!token || !receiver) return;

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/chat/${receiver}/`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      setMessages(data);
    } catch (err) {
      console.error("Error fetching messages:", err);
    }
  };

  const sendMessage = async () => {



    try {
      const response = await fetch("http://127.0.0.1:8000/api/send_message/", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sender: username,
          receiver: receiver,
          content: message,
        }),
      });

      setMessage("");
      fetchMessages(); // Odśwież wiadomości
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [receiver]);

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: 20 }}>
      <h2>Chat with <span style={{ color: "green" }}>{receiver}</span></h2>

      <div style={{ border: "1px solid #ccc", padding: 10, height: 300, overflowY: "auto" }}>
        {messages.length === 0 ? (
          <p>No messages.</p>
        ) : (
          messages.map((msg, idx) => (
            <div key={idx} style={{ marginBottom: 10 }}>
              <strong style={{ color: msg.sender === username ? "blue" : "green" }}>
                {msg.sender}
              </strong>
              <div>{msg.content}</div>
              <small>{new Date(msg.timestamp).toLocaleString()}</small>
              <hr />
            </div>
          ))
        )}
      </div>

      <div style={{ marginTop: 10 }}>
        <input
          type="text"
          placeholder="Type your message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          style={{ width: "80%", marginRight: 5 }}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default ChatRoom;
