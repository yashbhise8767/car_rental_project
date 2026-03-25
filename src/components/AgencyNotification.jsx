import React, { useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../context/AuthContext";

const AgencyNotification = () => {
  const { authData } = useAuth();
  let eventSource = null; // Store SSE reference

  useEffect(() => {
    if (!authData.token || authData.role !== "Agency") return;

    // ✅ Close any existing connection before creating a new one
    if (eventSource) {
      eventSource.close();
    }

    eventSource = new EventSource(
      `http://localhost:8000/agency/notifications/${authData.user.id}?token=${encodeURIComponent(authData.token)}`
    );

    eventSource.onmessage = (event) => {
      const message = event.data;

      // ✅ Show toast notification for agency
      toast.success(`New Order: ${message}`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    };

    eventSource.onerror = () => {
      console.error("SSE Error: Closing connection.");
      eventSource.close();
    };

    // ✅ Cleanup function to close connection on unmount
    return () => {
      if (eventSource) {
        eventSource.close();
      }
    };
  }, [authData]);

  return null;
};

export default AgencyNotification;
