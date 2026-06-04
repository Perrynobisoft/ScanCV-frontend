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
}
