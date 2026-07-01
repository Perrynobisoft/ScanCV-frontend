export const Constants = {
  PaginationConfigs: {
    DefaultSize: 10,
    UserListSize: 6,
    TalentPoolSize: 5,
    PageSizeList: [
      { label: '10 Result', value: 10 },
      { label: '25 Result', value: 25 },
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
  rejected: { label: 'Rejected', color: 'bg-red-500' },
  new: { label: 'New', color: 'bg-amber-500' },
  'in-process': { label: 'In-progress', color: 'bg-emerald-500' },
  contacted: { label: 'Contacted', color: 'bg-cyan-500' },
  hired: { label: 'Hired', color: 'bg-slate-600' },
} as const
