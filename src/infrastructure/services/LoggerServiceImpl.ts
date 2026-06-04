/* eslint-disable no-console */
import type { LoggerService } from '@/application/services/LoggerService'
import { env } from '@/env'
import dayjs from 'dayjs'
import { Constants } from '@/shared/constants'

export default class LoggerServiceImpl implements LoggerService {
  private readonly enabledLogger: boolean =
    env.VITE_APP_ENABLE_LOGGER === 'true'

  private getTimestamp() {
    return dayjs().format(Constants.DateTime.DateTimeFormat)
  }

  debug(...params: any[]) {
    if (this.enabledLogger)
      // biome-ignore lint/suspicious/noConsole: <explanation>
      console.debug(`[DEBUG] - ${this.getTimestamp()}: `, ...params)
  }

  error(...params: any[]) {
    if (this.enabledLogger)
      // biome-ignore lint/suspicious/noConsole: <explanation>
      console.error(`[ERROR] - ${this.getTimestamp()}: `, ...params)
  }

  fatal(...params: any[]) {
    if (this.enabledLogger)
      // biome-ignore lint/suspicious/noConsole: <explanation>
      console.error(`[ERROR] - ${this.getTimestamp()}: `, ...params)
  }

  info(...params: any[]) {
    if (this.enabledLogger)
      // biome-ignore lint/suspicious/noConsole: <explanation>
      console.info(`[INFO] - ${this.getTimestamp()}: `, ...params)
  }

  trace(...params: any[]) {
    if (this.enabledLogger)
      // biome-ignore lint/suspicious/noConsole: <explanation>
      console.trace(`[TRACE] - ${this.getTimestamp()}: `, ...params)
  }

  warn(...params: any[]) {
    if (this.enabledLogger)
      // biome-ignore lint/suspicious/noConsole: <explanation>
      console.warn(`[WARN] - ${this.getTimestamp()}: `, ...params)
  }
}
