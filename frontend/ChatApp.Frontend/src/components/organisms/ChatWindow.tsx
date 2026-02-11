import React, { useEffect, useState, useRef } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  setMessages,
  setLoadingMessages,
  addMessage,
} from "../../slices/chatSlice";
import { chatService } from "../../services/chatService";
import { MessageBubble } from "../molecules/MessageBubble";
import { Button } from "../atoms/Button";
import { Input } from "../atoms/Input";
import { LoadingSpinner } from "../atoms/LoadingSpinner";

export const ChatWindow: React.FC = () => {
  const dispatch = useAppDispatch();
  const { activeConversationId, messages, isLoadingMessages } = useAppSelector(
    (state) => state.chat,
  );
  const { user } = useAppSelector((state) => state.auth);

  const [messageText, setMessageText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activeConversationId) {
      loadMessages(activeConversationId);
    }
  }, [activeConversationId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, activeConversationId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const loadMessages = async (conversationId: string) => {
    dispatch(setLoadingMessages(true));
    try {
      const data = await chatService.getMessages(conversationId);
      dispatch(setMessages({ conversationId, messages: data }));
    } catch (error) {
      console.error("Failed to load messages:", error);
      dispatch(setLoadingMessages(false));
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!messageText.trim() || !activeConversationId || !user) return;

    setIsSending(true);
    try {
      const message = await chatService.sendMessage(
        activeConversationId,
        messageText.trim(),
      );
      dispatch(addMessage(message));
      setMessageText("");
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setIsSending(false);
    }
  };

  if (!activeConversationId) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50">
        <p className="text-gray-500 text-lg">
          Select a conversation to start chatting
        </p>
      </div>
    );
  }

  const currentMessages = messages[activeConversationId] || [];

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4">
        {isLoadingMessages ? (
          <LoadingSpinner />
        ) : currentMessages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">
              No messages yet. Start the conversation!
            </p>
          </div>
        ) : (
          <div>
            {currentMessages.map((message) => (
              <MessageBubble
                key={message.id}
                content={message.content}
                isMine={message.senderId === user?.id}
                sentAt={message.sentAt}
              />
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-200 bg-white p-4">
        <form onSubmit={handleSendMessage} className="flex space-x-2">
          <Input
            type="text"
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            placeholder="Type a message..."
            className="flex-1"
            disabled={isSending}
          />
          <Button
            type="submit"
            isLoading={isSending}
            disabled={!messageText.trim()}
          >
            Send
          </Button>
        </form>
      </div>
    </div>
  );
};
