
export const getBookmarks = (): string[] => {
  const saved = localStorage.getItem('dua_bookmarks');
  return saved ? JSON.parse(saved) : [];
};

export const toggleBookmark = (id: string): string[] => {
  const current = getBookmarks();
  const next = current.includes(id) 
    ? current.filter(i => i !== id) 
    : [...current, id];
  localStorage.setItem('dua_bookmarks', JSON.stringify(next));
  window.dispatchEvent(new Event('bookmarks-updated'));
  return next;
};

export const isBookmarked = (id: string): boolean => {
  return getBookmarks().includes(id);
};
