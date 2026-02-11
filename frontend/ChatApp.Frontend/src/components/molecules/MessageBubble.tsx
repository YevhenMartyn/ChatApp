import React from "react";

interface MessageBubbleProps {
  content: string;
  isMine: boolean;
  senderName?: string;
  timestamp: string;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  content,
  isMine,
  senderName,
  timestamp,
}) => {
  return (
    <div className={`flex ${isMine ? "justify-end" : "justify-start"} mb-4`}>
      <div className={`max-w-xs lg:max-w-md ${isMine ? "order-2" : "order-1"}`}>
        {!isMine && senderName && (
          <p className="text-xs text-gray-500 mb-1 px-2">{senderName}</p>
        )}
        <div
          className={`px-4 py-2 rounded-lg ${
            isMine
              ? "bg-primary-600 text-white rounded-br-none"
              : "bg-gray-200 text-gray-900 rounded-bl-none"
          }`}
        >
          <p className="break-words">{content}</p>
        </div>
        <p className="text-xs text-gray-400 mt-1 px-2">
          {new Date(timestamp).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>
    </div>
  );
};
