export const initSocket = (io) => {
  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    socket.on("joinConversation", (conversationId) => {
      socket.join(conversationId.toString());
      console.log(`Socket ${socket.id} joined conversation ${conversationId}`);
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.id);
    });
  });
};
