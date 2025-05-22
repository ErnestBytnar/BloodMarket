import React from 'react';
import { useParams } from 'react-router-dom';
import PrivateChat from './PrivateChat';

const ChatWrapper = () => {
    const { conversationId } = useParams();
    return <PrivateChat conversationId={conversationId} />;
};

export default ChatWrapper;
