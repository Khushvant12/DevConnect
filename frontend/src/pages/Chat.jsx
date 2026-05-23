import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { messageService } from '../services/messageService.js';
import { profileService } from '../services/profileService.js';
import ChatSidebar from '../components/chat/ChatSidebar.jsx';
import ChatWindow from '../components/chat/ChatWindow.jsx';

export default function Chat() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [conversations, setConversations] = useState([]);
  const [activePartner, setActivePartner] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadConversations = async () => {
    setLoading(true);
    try {
      const { data } = await messageService.getConversations();
      setConversations(data.data.conversations);

      const userParam = searchParams.get('user');
      if (userParam && !activePartner) {
        const found = data.data.conversations.find(
          (c) => String(c.partner?._id) === userParam
        );
        if (found) {
          setActivePartner(found.partner);
        } else {
          try {
            const p = await profileService.getProfile(userParam);
            setActivePartner(p.data.data.profile);
          } catch {
            setActivePartner({ _id: userParam, name: 'Developer', username: 'dev' });
          }
        }
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadConversations();
  }, []);

  useEffect(() => {
    const userParam = searchParams.get('user');
    if (userParam && conversations.length) {
      const found = conversations.find((c) => String(c.partner?._id) === userParam);
      if (found) setActivePartner(found.partner);
    }
  }, [searchParams, conversations]);

  const handleSelect = (partner) => {
    setActivePartner(partner);
    setSearchParams({ user: partner._id });
  };

  const handleBack = () => {
    setActivePartner(null);
    setSearchParams({});
  };

  const showSidebar = !activePartner;
  const showChat = !!activePartner;

  return (
    <div className="mx-auto flex h-[calc(100vh-4rem)] max-w-6xl flex-col overflow-hidden border-x border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900 lg:flex-row">
      {/* Conversation list */}
      <aside
        className={`flex w-full shrink-0 flex-col border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900 lg:w-[340px] lg:border-r ${
          showSidebar ? 'flex' : 'hidden lg:flex'
        }`}
        aria-label="Conversation list"
      >
        <div className="shrink-0 border-b border-slate-200/80 px-4 py-4 dark:border-slate-800">
          <h1 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
            Messages
          </h1>
          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
            Chat with developers in real time
          </p>
        </div>
        <ChatSidebar
          conversations={conversations}
          activeUserId={activePartner?._id}
          onSelect={handleSelect}
          loading={loading}
        />
      </aside>

      {/* Active chat */}
      <section
        className={`min-h-0 min-w-0 flex-1 flex-col ${
          showChat ? 'flex' : 'hidden lg:flex'
        }`}
        aria-label="Active conversation"
      >
        <ChatWindow partner={activePartner} onBack={handleBack} />
      </section>
    </div>
  );
}
