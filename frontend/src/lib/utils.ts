export const formatDate = (date: string | Date) =>
  new Date(date).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

export const formatDateTime = (date: string) =>
  new Date(date).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

export const getMinDate = () => {
  const d = new Date();
  return d.toISOString().split('T')[0];
};

export const statusColors: Record<string, string> = {
  Pending: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  Approved: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  Rejected: 'bg-red-500/20 text-red-400 border-red-500/30',
  Completed: 'bg-gold/10 text-gold border-gold/25',
};
