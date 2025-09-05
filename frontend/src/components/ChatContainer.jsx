import React, { useEffect, useRef, useState } from 'react';
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import ChatHeader from './ChatHeader';
import MessageInput from './MessageInput';
import MessageSkeleton from './skeletons/MessageSkeleton';
import { formatMessageTime } from "../lib/utils.js"

const ChatContainer = () => {
  const { messages, getMessages, isMessagesLoading, selectedUser, subscribeToMessages, unsubscribeFromMessages, smartReplies, getSmartReplies, clearSmartReplies, fetchedFromDB } = useChatStore();
  const { authUser, socket } = useAuthStore();
  const ChatContainerRef = useRef(null);
  const lastMessageRef = useRef(null);

  useEffect(() => {
    useChatStore.setState({ messages: [], fetchedFromDB: false });
    // --------------------------------------
    // console.log("Sending first get req");
    // --------------------------------------
    getMessages(selectedUser._id);

    subscribeToMessages(socket);

    return () => unsubscribeFromMessages(socket);
  }, [selectedUser._id]);

  useEffect(() => {
    if (!fetchedFromDB && lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
      useChatStore.setState({ fetchedFromDB: false });
    }
  }, [messages, smartReplies, fetchedFromDB]);

  useEffect(() => {
    clearSmartReplies();
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1];

      if (lastMessage.senderId !== authUser._id) {
        const lastMessageText = lastMessage.text;
        if (lastMessageText.length > 0) getSmartReplies(lastMessageText);
      }
    }
  }, [messages])

  useEffect(() => {
    const container = ChatContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      if (container.scrollTop === 0 && messages.length > 0) {
        // const oldestMessageTime = messages[0].createdAt;
        // --------------------------------------
        // console.log("Sending more get reqs");
        // --------------------------------------
        getMessages(selectedUser._id);
      }
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [messages, selectedUser]);


  if (isMessagesLoading) {
    return (
      <div className='flex-1 flex flex-col overflow-auto'>
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    )
  }
  return (
    <div className='flex-1 flex flex-col overflow-auto'>
      <ChatHeader />

      <div ref={ChatContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div key={message._id}
            ref={index === messages.length - 1 ? lastMessageRef : null}
            className={`chat ${message.senderId === authUser._id ? "chat-end" : "chat-start"}`}>
            <div className="chat-image avatar">
              <div className="size-10 rounded-full border">
                <img
                  src={
                    message.senderId === authUser._id
                      ? authUser.profilePic || "/avatar.png"
                      : selectedUser.profilePic || "/avatar.png"
                  }
                  alt="profile picture"
                />
              </div>
            </div>
            <div className="chat-header mb-1">
              <time className="test-xs opacity-50 ml-1">{formatMessageTime(message.createdAt)}</time>
            </div>
            <div className="chat-bubble flex flex-col">
              {message.image && (
                <img
                  src={message.image}
                  alt="Attachment"
                  className="sm:max-w-[200px] rounded-md mb-2"
                />
              )}
              {message.text && <p>{message.text}</p>}
            </div>
          </div>
        ))}
      </div>

      <MessageInput />

    </div>
  )
}

export default ChatContainer