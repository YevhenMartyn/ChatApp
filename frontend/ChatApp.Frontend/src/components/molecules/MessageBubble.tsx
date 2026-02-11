import React from "react";

interface MessageBubbleProps {
  content: string;
  isMine: boolean;
  sentAt: string;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  content,
  isMine,
  sentAt,
}) => {
  return (
    <div className={`flex ${isMine ? "justify-end" : "justify-start"} mb-4`}>
      <div className={`max-w-xs lg:max-w-md ${isMine ? "order-2" : "order-1"}`}>
        <div
          className={`px-4 py-2 rounded-lg ${
            isMine
              ? "bg-blue-600 text-white rounded-br-none"
              : "bg-gray-200 text-black rounded-bl-none"
          }`}
        >
          <p className="break-words">{content}</p>
        </div>
        <p className="text-xs text-gray-600 mt-1 px-2">
          {new Date(sentAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>
    </div>
  );
};
