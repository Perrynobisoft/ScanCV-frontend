export enum SearchMode {
  Keyword = 'keyword',
  Ai = 'ai',
}

export const SEARCH_MODE_OPTIONS = [
  { value: SearchMode.Keyword, label: 'Keyword search' },
  { value: SearchMode.Ai, label: 'AI search' },
]
