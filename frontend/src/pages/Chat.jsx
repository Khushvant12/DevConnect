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

  return (
    <div className="mx-auto flex h-[calc(100vh-4rem)] max-w-7xl flex-col lg:flex-row">
      <aside className="w-full shrink-0 overflow-y-auto border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950 lg:w-80 lg:border-b-0 lg:border-r">
        <div className="border-b border-slate-100 px-4 py-3 dark:border-slate-800">
          <h1 className="font-bold text-slate-900 dark:text-white">Messages</h1>
        </div>
        <ChatSidebar
          conversations={conversations}
          activeUserId={activePartner?._id}
          onSelect={handleSelect}
          loading={loading}
        />
      </aside>
      <div className="flex min-h-0 flex-1 flex-col bg-white dark:bg-slate-950">
        <ChatWindow partner={activePartner} />
      </div>
    </div>
  );
}
