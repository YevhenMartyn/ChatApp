import { useEffect, useState } from "react";
import * as signalR from "@microsoft/signalr";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { messageReceived } from "../slices/chatSlice";
import { SIGNALR_HUB_URL } from "../constants/routes";

export const useSignalR = () => {
  const dispatch = useAppDispatch();
  const { isAuthenticated, token } = useAppSelector((state) => state.auth);
  // Get the active conversation to know which group to join
  const { activeConversationId } = useAppSelector((state) => state.chat);

  // Use state instead of ref so we can trigger the second useEffect when connection is ready
  const [connection, setConnection] = useState<signalR.HubConnection | null>(
    null,
  );

  // 1. Manage Connection Lifecycle
  useEffect(() => {
    if (!isAuthenticated || !token) return;

    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl(SIGNALR_HUB_URL, {
        accessTokenFactory: () => token,
      })
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Information)
      .build();

    newConnection.on("ReceiveMessage", (message) => {
      console.log("Message received via SignalR:", message);
      dispatch(messageReceived(message));
    });

    // Start connection
    newConnection
      .start()
      .then(() => {
        console.log("SignalR connected successfully");
        setConnection(newConnection);
      })
      .catch((err) => console.error("SignalR connection error:", err));

    return () => {
      // Cleanup: Stop connection
      newConnection
        .stop()
        .then(() => console.log("SignalR connection stopped"));
    };
  }, [isAuthenticated, token, dispatch]);

  // 2. Manage Conversation Groups (Join/Leave)
  useEffect(() => {
    if (
      connection &&
      connection.state === signalR.HubConnectionState.Connected &&
      activeConversationId
    ) {
      console.log(`Joining conversation group: ${activeConversationId}`);

      // Call the Hub method defined in ChatHub.cs
      connection
        .invoke("JoinConversation", activeConversationId)
        .catch((err) => console.error("Failed to join conversation:", err));

      return () => {
        console.log(`Leaving conversation group: ${activeConversationId}`);
        // Optional: Call LeaveConversation if you want to be strict,
        // though switching groups implies leaving the previous one usually.
        connection
          .invoke("LeaveConversation", activeConversationId)
          .catch((err) => console.error("Failed to leave conversation:", err));
      };
    }
  }, [connection, activeConversationId]);

  return connection;
};
