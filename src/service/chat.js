const connectWebSocket = ({ userId, onopen, onmessage, onclose }) => {
  const socket = new WebSocket('ws://localhost:8080/chat');

  socket.onopen = () => {
    socket.send(JSON.stringify({ type: 'register', userId: userId }));
    if (onopen) onopen();
  };

  socket.onmessage = (event) => {
    if (onmessage) onmessage(event.data);
  };

  socket.onclose = () => {
    if (onclose) onclose();
  };

  return {
    send: (message) => {
      socket.send(JSON.stringify(message));
    },
    close: () => {
      socket.close();
    },
  };
};

export default connectWebSocket;
