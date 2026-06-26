export const Constants = {
  PaginationConfigs: {
    Size: 10,
    PageSizeList: [
      { label: '10 Result', value: 10 },
      { label: '20 Result', value: 20 },
      { label: '50 Result', value: 50 },
      { label: '100 Result', value: 100 },
    ],
  },
  API_USER_STORAGE: 'API_APP_USER',
  API_TOKEN_STORAGE: 'API_APP_AT',
  API_REFRESH_TOKEN_STORAGE: 'API_APP_RT',

  REPLACE_ROUTER_CONFIG: {
    type: ':type',
    id: ':id',
  },

  DateTime: {
    DateTimeFormat: 'yyyy-MM-DD HH:mm:ss.SSSS',
    DateFormat: 'yyyy-MM-DD',
  },

  BULK_UPLOAD_BATCH_ID_KEY: 'bulk_upload_batch_id',

  CV_STATUS: {
    REJECTED: 'rejected',
    NEW: 'new',
    IN_PROGRESS: 'in-progress',
    CONTACTED: 'contacted',
    HIRED: 'hired',
  },
}

export const CV_STATUS_LABELS = {
  rejected: { label: 'Rejected', color: 'red-500' },
  new: { label: 'New', color: 'amber-500' },
  'in-progress': { label: 'In-progress', color: 'emerald-500' },
  contacted: { label: 'Contacted', color: 'cyan-500' },
  hired: { label: 'Hired', color: 'slate-600' },
} as const
