import { useState, useEffect } from 'react';
import { Bell, CheckCircle2, Info, AlertTriangle, Loader2 } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const fetchNotifications = async () => {
    if (!user) return;
    try {
      const res = await axios.get('http://localhost:5000/api/notifications');
      setNotifications(res.data);
      setUnreadCount(res.data.filter(n => !n.isRead).length);
    } catch (err) { console.error('Notifications fetch failed'); }
  };

  useEffect(() => {
    if (user) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 30000); // Poll every 30s
      return () => clearInterval(interval);
    }
  }, [user]);

  const markAsRead = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/notifications/${id}/read`);
      fetchNotifications();
    } catch (err) { console.error('Failed to mark read'); }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'success': return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
      case 'alert': return <AlertTriangle className="w-4 h-4 text-amber-500" />;
      default: return <Info className="w-4 h-4 text-blue-500" />;
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2.5 bg-slate-100 dark:bg-slate-800 rounded-xl relative group transition-all hover:scale-105"
      >
        <Bell className="w-5 h-5 text-slate-600 dark:text-slate-400 group-hover:text-emerald-500" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 border-2 border-white dark:border-slate-900 text-white text-[10px] font-black rounded-full flex items-center justify-center animate-bounce">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-4 w-80 bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 z-50 overflow-hidden">
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/30">
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-900 dark:text-white">Alert Queue</h3>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter italic">Secured Terminal</span>
            </div>

            <div className="max-h-96 overflow-y-auto scrollbar-hide">
              {notifications.length === 0 ? (
                <div className="p-10 text-center">
                  <Bell className="w-10 h-10 text-slate-200 dark:text-slate-800 mx-auto mb-3" />
                  <p className="text-sm font-bold text-slate-400 italic">No new messages in log.</p>
                </div>
              ) : (
                notifications.map(n => (
                  <div
                    key={n._id}
                    onClick={() => markAsRead(n._id)}
                    className={`p-4 border-b border-slate-50 dark:border-slate-800/50 cursor-pointer transition-colors ${n.isRead ? 'opacity-60' : 'bg-emerald-500/5 dark:bg-emerald-500/10'}`}
                  >
                    <div className="flex gap-3">
                      <div className="mt-1">{getIcon(n.type)}</div>
                      <div>
                        <p className="text-xs font-black text-slate-900 dark:text-white leading-tight mb-1">{n.title}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-snug">{n.message}</p>
                        <p className="text-[10px] font-mono text-slate-300 dark:text-slate-600 mt-2">
                          {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <button className="w-full py-3 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-emerald-500 transition-colors bg-slate-50 dark:bg-slate-800/50">
              View History Log
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default NotificationBell;
