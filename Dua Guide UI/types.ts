
export interface Dua {
  id: string;
  title: string;
  arabic: string;
  transliteration: string;
  translation: string;
  reference?: string;
  benefits?: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  duas: Dua[];
  color: string;
}

export interface AppState {
  currentCategoryId: string | null;
  currentDuaIndex: number;
}
