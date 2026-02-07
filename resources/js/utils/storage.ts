
export const getBookmarks = (): number[] => {
  if (typeof window === 'undefined') return [];
  const saved = localStorage.getItem('dua_bookmarks');
  // Parse and ensure they are numbers (since our DB IDs are numbers)
  return saved ? JSON.parse(saved).map((id: any) => Number(id)) : [];
};

export const toggleBookmark = (id: number): number[] => {
  if (typeof window === 'undefined') return [];
  const current = getBookmarks();
  const next = current.includes(id)
    ? current.filter(i => i !== id)
    : [...current, id];
  localStorage.setItem('dua_bookmarks', JSON.stringify(next));
  window.dispatchEvent(new Event('bookmarks-updated'));
  return next;
};

export const isBookmarked = (id: number): boolean => {
  return getBookmarks().includes(id);
};
