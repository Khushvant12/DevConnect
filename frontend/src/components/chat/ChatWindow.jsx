import { useCallback, useEffect, useRef, useState } from 'react';
import { messageService } from '../../services/messageService.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { useSocket } from '../../context/SocketContext.jsx';
import MessageBubble from './MessageBubble.jsx';
import TypingIndicator from './TypingIndicator.jsx';
import Button from '../ui/Button.jsx';

export default function ChatWindow({ partner }) {
  const { user } = useAuth();
  const {
    socket,
    connected,
    joinChat,
    leaveChat,
    sendMessage,
    emitTyping,
    emitStopTyping,
    markMessagesRead,
    isUserOnline,
  } = useSocket();

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [typing, setTyping] = useState(false);
  const [sending, setSending] = useState(false);

  const bottomRef = useRef(null);
  const listRef = useRef(null);
  const typingTimeout = useRef(null);

  const partnerId = partner?._id;

  const scrollToBottom = (smooth = true) => {
    bottomRef.current?.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto' });
  };

  const loadMessages = useCallback(
    async (pageNum = 1, append = false) => {
      if (!partnerId) return;
      if (pageNum === 1) setLoading(true);
      else setLoadingMore(true);

      try {
        const { data } = await messageService.getMessages(partnerId, {
          page: pageNum,
          limit: 30,
        });
        setMessages((prev) =>
          append ? [...data.data.messages, ...prev] : data.data.messages
        );
        setHasMore(data.data.pagination.hasMore);
        setPage(pageNum);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [partnerId]
  );

  useEffect(() => {
    if (!partnerId) return;
    setMessages([]);
    setPage(1);
    loadMessages(1, false).then(() => {
      scrollToBottom(false);
      markMessagesRead(partnerId);
    });
    joinChat(partnerId);
    return () => leaveChat(partnerId);
  }, [partnerId, joinChat, leaveChat, loadMessages, markMessagesRead]);

  useEffect(() => {
    if (!socket || !partnerId) return;

    const onMessage = ({ message }) => {
      const involves =
        (String(message.sender._id) === String(partnerId) &&
          String(message.receiver._id) === String(user._id)) ||
        (String(message.sender._id) === String(user._id) &&
          String(message.receiver._id) === String(partnerId));

      if (!involves) return;

      setMessages((prev) => {
        if (prev.some((m) => m._id === message._id)) return prev;
        return [...prev, message];
      });
      scrollToBottom();

      if (String(message.sender._id) === String(partnerId)) {
        markMessagesRead(partnerId, [message._id]);
      }
    };

    const onTyping = ({ userId }) => {
      if (String(userId) === String(partnerId)) setTyping(true);
    };
    const onStopTyping = ({ userId }) => {
      if (String(userId) === String(partnerId)) setTyping(false);
    };

    socket.on('receive_message', onMessage);
    socket.on('typing', onTyping);
    socket.on('stop_typing', onStopTyping);

    return () => {
      socket.off('receive_message', onMessage);
      socket.off('typing', onTyping);
      socket.off('stop_typing', onStopTyping);
    };
  }, [socket, partnerId, user._id, markMessagesRead]);

  useEffect(() => {
    scrollToBottom();
  }, [messages.length]);

  const handleScroll = () => {
    const el = listRef.current;
    if (!el || loadingMore || !hasMore) return;
    if (el.scrollTop < 80) {
      loadMessages(page + 1, true);
    }
  };

  const handleInput = (e) => {
    setText(e.target.value);
    emitTyping(partnerId);
    clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => emitStopTyping(partnerId), 1200);
  };

  const handleSend = async (e) => {
  e.preventDefault();

  if (!text.trim() || !connected) return;

  setSending(true);
  emitStopTyping(partnerId);

  try {
    await sendMessage(partnerId, text.trim());
    setText('');
  } catch {
    await messageService.sendMessage(partnerId, text.trim());
    setText('');
  } finally {
    setSending(false);
  }
};

  if (!partner) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center bg-slate-50/50 p-8 text-center dark:bg-slate-900/30">
        <p className="text-lg font-medium text-slate-600 dark:text-slate-400">
          Select a conversation
        </p>
        <p className="mt-1 text-sm text-slate-500">Choose a developer from the sidebar</p>
      </div>
    );
  }

  const online = isUserOnline(partnerId) || partner.isOnline;

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex items-center gap-3 border-b border-slate-200 px-4 py-3 dark:border-slate-800">
        {partner.avatar ? (
          <img src={partner.avatar} alt="" className="h-10 w-10 rounded-full object-cover" />
        ) : (
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-100 font-bold text-brand-700">
            {partner.name?.charAt(0)}
          </div>
        )}
        <div>
          <p className="font-semibold text-slate-900 dark:text-white">{partner.name}</p>
          <p className="text-xs text-slate-500">
            {online ? (
              <span className="text-green-600">Online</span>
            ) : (
              'Offline'
            )}{' '}
            · @{partner.username}
          </p>
        </div>
        {!connected && (
          <span className="ml-auto text-xs text-amber-600">Reconnecting...</span>
        )}
      </div>

      <div
        ref={listRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-4 space-y-3"
      >
        {loadingMore && (
          <p className="text-center text-xs text-slate-400">Loading older messages...</p>
        )}
        {loading ? (
          <p className="text-center text-sm text-slate-500">Loading messages...</p>
        ) : (
          messages.map((m) => (
            <MessageBubble
              key={m._id}
              message={m}
              isOwn={String(m.sender._id || m.sender) === String(user._id)}
            />
          ))
        )}
        {typing && <TypingIndicator name={partner.name?.split(' ')[0]} />}
        <div ref={bottomRef} />
      </div>

      <form
        onSubmit={handleSend}
        className="border-t border-slate-200 p-4 dark:border-slate-800"
      >
        <div className="flex gap-2">
          <input
            value={text}
            onChange={handleInput}
            placeholder="Type a message..."
            className="input-field flex-1"
            maxLength={2000}
          />
          <Button type="submit" loading={sending} disabled={!connected}>
            Send
          </Button>
        </div>
      </form>
    </div>
  );
}
