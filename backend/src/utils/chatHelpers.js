/**
 * Deterministic conversation id for two users (order-independent).
 */
export const getConversationId = (userIdA, userIdB) => {
  const ids = [String(userIdA), String(userIdB)].sort();
  return `${ids[0]}_${ids[1]}`;
};

/**
 * Socket room for a private chat between two users.
 */
export const getPrivateRoom = (userIdA, userIdB) => {
  return `chat:${getConversationId(userIdA, userIdB)}`;
};

/**
 * Per-user socket room for direct emits (notifications, messages).
 */
export const getUserRoom = (userId) => `user:${userId}`;
