import { useEffect, useRef } from "react";
import * as signalR from "@microsoft/signalr";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { messageReceived } from "../slices/chatSlice";
import { SIGNALR_HUB_URL } from "../constants/routes";

export const useSignalR = () => {
  const dispatch = useAppDispatch();
  const { isAuthenticated, token } = useAppSelector((state) => state.auth);
  const connectionRef = useRef<signalR.HubConnection | null>(null);

  useEffect(() => {
    if (!isAuthenticated || !token) {
      // Disconnect if user is not authenticated
      if (connectionRef.current) {
        connectionRef.current.stop();
        connectionRef.current = null;
      }
      return;
    }

    // Create SignalR connection with JWT token
    const connection = new signalR.HubConnectionBuilder()
      .withUrl(SIGNALR_HUB_URL, {
        accessTokenFactory: () => token,
      })
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Information)
      .build();

    // Listen for incoming messages
    connection.on("ReceiveMessage", (message) => {
      console.log("Message received via SignalR:", message);
      dispatch(messageReceived(message));
    });

    // Handle reconnection
    connection.onreconnected(() => {
      console.log("SignalR reconnected");
    });

    connection.onreconnecting(() => {
      console.log("SignalR reconnecting...");
    });

    connection.onclose(() => {
      console.log("SignalR connection closed");
    });

    // Start the connection
    connection
      .start()
      .then(() => {
        console.log("SignalR connected successfully");
      })
      .catch((err) => {
        console.error("SignalR connection error:", err);
      });

    connectionRef.current = connection;

    // Cleanup on unmount or when auth changes
    return () => {
      if (connectionRef.current) {
        connectionRef.current.stop();
        connectionRef.current = null;
      }
    };
  }, [isAuthenticated, token, dispatch]);

  return connectionRef.current;
};
