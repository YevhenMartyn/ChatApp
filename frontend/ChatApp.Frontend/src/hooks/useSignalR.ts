import { useEffect, useState } from "react";
import * as signalR from "@microsoft/signalr";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { messageReceived } from "../slices/chatSlice";
import { SIGNALR_HUB_URL } from "../constants/routes";

export const useSignalR = () => {
  const dispatch = useAppDispatch();
  const { isAuthenticated, token } = useAppSelector((state) => state.auth);
  const { activeConversationId } = useAppSelector((state) => state.chat);

  const [connection, setConnection] = useState<signalR.HubConnection | null>(
    null,
  );

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

    newConnection
      .start()
      .then(() => {
        console.log("SignalR connected successfully");
        setConnection(newConnection);
      })
      .catch((err) => console.error("SignalR connection error:", err));

    return () => {
      newConnection
        .stop()
        .then(() => console.log("SignalR connection stopped"));
    };
  }, [isAuthenticated, token, dispatch]);

  useEffect(() => {
    if (
      connection &&
      connection.state === signalR.HubConnectionState.Connected &&
      activeConversationId
    ) {
      console.log(`Joining conversation group: ${activeConversationId}`);
      connection
        .invoke("JoinConversation", activeConversationId)
        .catch((err) => console.error("Failed to join conversation:", err));

      return () => {
        console.log(`Leaving conversation group: ${activeConversationId}`);
        connection
          .invoke("LeaveConversation", activeConversationId)
          .catch((err) => console.error("Failed to leave conversation:", err));
      };
    }
  }, [connection, activeConversationId]);

  return connection;
};
