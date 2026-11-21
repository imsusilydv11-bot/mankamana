import { useMemo, useState } from 'react';
import { Search, Trash2, MailOpen, Mail } from 'lucide-react';
import { ContactMessage } from '../../types/hotel';
import {
  deleteContactMessage,
  markContactMessageRead,
} from '../../services/hotelService';
import { useToast } from '../../components/common/Toast';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';

interface AdminMessagesProps {
  messages: ContactMessage[];
}

export function AdminMessages({ messages }: AdminMessagesProps) {
  const { showToast } = useToast();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [deleteTarget, setDeleteTarget] = useState<ContactMessage | null>(null);
  const [deleting, setDeleting] = useState(false);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return messages.filter((m) => {
      if (filter === 'unread' && m.isRead) return false;
      if (filter === 'read' && !m.isRead) return false;
      if (!q) return true;
      return (
        m.name.toLowerCase().includes(q) ||
        m.email.toLowerCase().includes(q) ||
        m.subject.toLowerCase().includes(q) ||
        m.message.toLowerCase().includes(q)
      );
    });
  }, [messages, search, filter]);

  const handleToggleRead = async (msg: ContactMessage) => {
    try {
      await markContactMessageRead(msg.id, !msg.isRead);
      showToast(msg.isRead ? 'Marked as unread.' : 'Marked as read.', 'success');
    } catch (err) {
      console.error(err);
      showToast('Failed to update message status.', 'error');
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteContactMessage(deleteTarget.id);
      showToast('Message deleted.', 'success');
      setDeleteTarget(null);
    } catch (err) {
      console.error(err);
      showToast('Failed to delete message.', 'error');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search contact messages..."
              className="pl-9 pr-3 py-2 border border-slate-300 bg-white text-sm w-64 focus:outline-none focus:border-slate-900"
            />
          </div>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as typeof filter)}
            className="px-3 py-2 border border-slate-300 bg-white text-sm"
          >
            <option value="all">All Messages</option>
            <option value="unread">Unread Only</option>
            <option value="read">Read Only</option>
          </select>
        </div>
        <p className="text-xs text-slate-500 font-mono tabular-nums">
          {filtered.length} message{filtered.length === 1 ? '' : 's'}
        </p>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white border border-slate-200 p-12 text-center text-sm text-slate-500">
          No contact messages matching the current filter.
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((msg) => (
            <div
              key={msg.id}
              className={`bg-white border p-5 transition-colors ${
                msg.isRead ? 'border-slate-200' : 'border-l-4 border-l-amber-600 border-slate-200'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
                <div>
                  <div className="flex items-center gap-2.5">
                    <h3 className="text-sm font-semibold text-slate-900">{msg.subject}</h3>
                    {!msg.isRead && (
                      <span className="px-2 py-0.5 bg-amber-50 text-amber-800 text-[11px] font-medium">
                        Unread
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 mt-1">
                    From <span className="font-medium text-slate-900">{msg.name}</span> &middot;{' '}
                    <a href={`mailto:${msg.email}`} className="underline hover:text-slate-900">
                      {msg.email}
                    </a>
                    {msg.phone ? <span className="tabular-nums"> &middot; {msg.phone}</span> : null}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleToggleRead(msg)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 text-xs text-slate-700 hover:bg-slate-50"
                  >
                    {msg.isRead ? <Mail className="w-3.5 h-3.5" /> : <MailOpen className="w-3.5 h-3.5" />}
                    <span>{msg.isRead ? 'Mark Unread' : 'Mark Read'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteTarget(msg)}
                    aria-label="Delete message"
                    className="p-1.5 text-red-600 hover:text-red-800 border border-slate-200 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <p className="text-sm text-slate-700 whitespace-pre-line leading-relaxed bg-slate-50 p-3.5 border border-slate-100">
                {msg.message}
              </p>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete Contact Message"
        description={`Delete message "${deleteTarget?.subject}" from ${deleteTarget?.name}?`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />
    </div>
  );
}
