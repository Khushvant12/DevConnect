import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { messageService } from '../../services/messageService.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { useSocket } from '../../context/SocketContext.jsx';
import {
  formatDateDivider,
  isGroupedWithPrevious,
  isSameDay,
} from '../../utils/chatFormat.js';
import MessageBubble from './MessageBubble.jsx';
import TypingIndicator from './TypingIndicator.jsx';
import PresenceDot from './PresenceDot.jsx';
import LoadingSpinner from '../ui/LoadingSpinner.jsx';

function DateDivider({ label }) {
  return (
    <div className="relative my-6 flex items-center justify-center">
      <div className="absolute inset-x-0 top-1/2 h-px bg-slate-200 dark:bg-slate-800" aria-hidden="true" />
      <span className="relative rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-500 dark:bg-slate-800 dark:text-slate-400">
        {label}
      </span>
    </div>
  );
}

function ChatEmptyState() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-8 py-16 text-center">
      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500">
        <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          />
        </svg>
      </div>
      <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200">Your messages</h2>
      <p className="mt-2 max-w-xs text-sm leading-relaxed text-slate-500 dark:text-slate-400">
        Select a conversation from the list or find a developer to start chatting.
      </p>
      <Link
        to="/developers"
        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700"
      >
        Find developers
      </Link>
    </div>
  );
}

export default function ChatWindow({ partner, onBack }) {
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
  const inputRef = useRef(null);
  const typingTimeout = useRef(null);
  const shouldScrollRef = useRef(true);

  const partnerId = partner?._id;

  const scrollToBottom = useCallback((smooth = true) => {
    bottomRef.current?.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto', block: 'end' });
  }, []);

  const loadMessages = useCallback(
    async (pageNum = 1, append = false) => {
      if (!partnerId) return;
      if (pageNum === 1) setLoading(true);
      else setLoadingMore(true);

      const el = listRef.current;
      const prevHeight = el?.scrollHeight ?? 0;

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

        if (append && el) {
          requestAnimationFrame(() => {
            el.scrollTop = el.scrollHeight - prevHeight;
          });
        }
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
    shouldScrollRef.current = true;
    loadMessages(1, false).then(() => {
      scrollToBottom(false);
      markMessagesRead(partnerId);
    });
    joinChat(partnerId);
    return () => leaveChat(partnerId);
  }, [partnerId, joinChat, leaveChat, loadMessages, markMessagesRead, scrollToBottom]);

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
      shouldScrollRef.current = true;

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
    if (shouldScrollRef.current) {
      scrollToBottom();
      shouldScrollRef.current = false;
    }
  }, [messages.length, typing, scrollToBottom]);

  const handleScroll = () => {
    const el = listRef.current;
    if (!el || loadingMore || !hasMore) return;
    if (el.scrollTop < 80) {
      shouldScrollRef.current = false;
      loadMessages(page + 1, true);
    }
  };

  const handleInput = (e) => {
    setText(e.target.value);
    emitTyping(partnerId);
    clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => emitStopTyping(partnerId), 1200);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend(e);
    }
  };

  const handleSend = async (e) => {
    e?.preventDefault?.();
    if (!text.trim() || !connected || !partnerId) return;

    setSending(true);
    emitStopTyping(partnerId);
    shouldScrollRef.current = true;

    try {
      await sendMessage(partnerId, text.trim());
      setText('');
      inputRef.current?.focus();
    } catch {
      await messageService.sendMessage(partnerId, text.trim());
      setText('');
    } finally {
      setSending(false);
    }
  };

  if (!partner) {
    return <ChatEmptyState />;
  }

  const online = isUserOnline(partnerId) || partner.isOnline;

  const renderMessages = () => {
    const items = [];

    messages.forEach((m, i) => {
      const prev = messages[i - 1];
      if (!prev || !isSameDay(prev.createdAt, m.createdAt)) {
        items.push(
          <DateDivider key={`date-${m.createdAt}-${i}`} label={formatDateDivider(m.createdAt)} />
        );
      }

      const isOwn = String(m.sender._id || m.sender) === String(user._id);
      const grouped = isGroupedWithPrevious(prev, m);
      const showAvatar = !isOwn && !grouped;

      items.push(
        <MessageBubble
          key={m._id}
          message={m}
          isOwn={isOwn}
          isGrouped={grouped}
          showAvatar={showAvatar}
          avatarUrl={partner.avatar}
          senderName={partner.name}
        />
      );
    });

    return items;
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-slate-50/80 dark:bg-slate-950">
      {/* Header */}
      <header className="flex shrink-0 items-center gap-3 border-b border-slate-200/80 bg-white/95 px-3 py-3 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/95 sm:px-4">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="btn-ghost !p-2 lg:hidden"
            aria-label="Back to conversations"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}

        <Link
          to={`/developers/${partner.username}`}
          className="flex min-w-0 flex-1 items-center gap-3 rounded-xl p-1 transition hover:bg-slate-50 dark:hover:bg-slate-800/50"
        >
          <div className="relative shrink-0">
            {partner.avatar ? (
              <img
                src={partner.avatar}
                alt=""
                className="h-10 w-10 rounded-full object-cover ring-2 ring-slate-100 dark:ring-slate-800"
              />
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-brand-100 to-brand-200 text-sm font-bold text-brand-700 dark:from-brand-900 dark:to-brand-950 dark:text-brand-300">
                {partner.name?.charAt(0)}
              </div>
            )}
            <span className="absolute -bottom-0.5 -right-0.5">
              <PresenceDot online={online} size="sm" />
            </span>
          </div>
          <div className="min-w-0">
            <p className="truncate font-semibold text-slate-900 dark:text-white">{partner.name}</p>
            <p className="flex items-center gap-1.5 text-xs">
              <span className={online ? 'font-medium text-emerald-600 dark:text-emerald-400' : 'text-slate-500'}>
                {online ? 'Active now' : 'Offline'}
              </span>
              <span className="text-slate-300 dark:text-slate-600">·</span>
              <span className="truncate font-mono text-slate-400">@{partner.username}</span>
            </p>
          </div>
        </Link>

        {!connected && (
          <span className="shrink-0 rounded-lg bg-amber-50 px-2 py-1 text-[11px] font-medium text-amber-700 dark:bg-amber-950/40 dark:text-amber-400">
            Reconnecting…
          </span>
        )}
      </header>

      {/* Messages */}
      <div
        ref={listRef}
        onScroll={handleScroll}
        className="chat-scroll relative flex-1 overflow-y-auto px-3 py-4 sm:px-5"
        role="log"
        aria-live="polite"
        aria-label="Message history"
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.35] dark:opacity-[0.15]"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, rgb(148 163 184 / 0.25) 1px, transparent 0)',
            backgroundSize: '24px 24px',
          }}
          aria-hidden="true"
        />

        <div className="relative min-h-full">
          {loadingMore && (
            <div className="mb-4 flex justify-center">
              <LoadingSpinner size="sm" label="Loading older messages" />
            </div>
          )}

          {loading ? (
            <div className="flex flex-1 items-center justify-center py-20">
              <LoadingSpinner label="Loading messages" />
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                No messages yet
              </p>
              <p className="mt-1 text-xs text-slate-500">Say hello to start the conversation</p>
            </div>
          ) : (
            renderMessages()
          )}

          {typing && (
            <TypingIndicator
              name={partner.name?.split(' ')[0]}
              avatarUrl={partner.avatar}
            />
          )}
          <div ref={bottomRef} className="h-1" aria-hidden="true" />
        </div>
      </div>

      {/* Composer */}
      <form
        onSubmit={handleSend}
        className="shrink-0 border-t border-slate-200/80 bg-white/95 p-3 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/95 sm:p-4"
      >
        <div className="flex items-end gap-2 rounded-2xl border border-slate-200/80 bg-slate-50 p-2 shadow-sm transition focus-within:border-brand-400 focus-within:ring-2 focus-within:ring-brand-500/20 dark:border-slate-700 dark:bg-slate-800/80 dark:focus-within:border-brand-600">
          <textarea
            ref={inputRef}
            value={text}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            placeholder="Write a message…"
            rows={1}
            className="max-h-32 min-h-[2.5rem] flex-1 resize-none bg-transparent px-2 py-2 text-sm leading-relaxed text-slate-900 placeholder:text-slate-400 focus:outline-none dark:text-slate-100 dark:placeholder:text-slate-500"
            maxLength={2000}
            aria-label="Message input"
          />
          <button
            type="submit"
            disabled={!text.trim() || !connected || sending}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-600 text-white transition-all duration-200 hover:bg-brand-700 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-brand-600"
            aria-label="Send message"
          >
            {sending ? (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            ) : (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            )}
          </button>
        </div>
        <p className="mt-2 hidden text-center text-[11px] text-slate-400 sm:block">
          Press Enter to send · Shift+Enter for new line
        </p>
      </form>
    </div>
  );
}
