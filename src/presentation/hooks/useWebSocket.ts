import { useCallback, useEffect, useRef, useState } from 'react'

export default function useWebSocket<T = any>() {
  const wsRef = useRef<WebSocket | null>(null)
  const [connected, setConnected] = useState(false)
  const [messages, setMessages] = useState<T[]>([])

  const connect = useCallback((url: string) => {
    if (!url) return
    if (wsRef.current) wsRef.current.close()

    const ws = new WebSocket(url)
    wsRef.current = ws

    ws.onopen = () => setConnected(true)
    ws.onclose = () => setConnected(false)
    ws.onerror = () => setConnected(false)
    ws.onmessage = (ev) => {
      try {
        const data = JSON.parse(ev.data)
        setMessages((prev) => [...prev, data])
      } catch {
        // push raw if not JSON
        setMessages((prev) => [...prev, ev.data])
      }
    }
  }, [])

  const disconnect = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close()
      wsRef.current = null
    }
    setMessages([])
    setConnected(false)
  }, [])

  const send = useCallback((data: any) => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN)
      return false
    try {
      const payload = typeof data === 'string' ? data : JSON.stringify(data)
      wsRef.current.send(payload)
      return true
    } catch {
      return false
    }
  }, [])

  useEffect(() => {
    return () => {
      if (wsRef.current) wsRef.current.close()
    }
  }, [])

  return { connect, disconnect, send, connected, messages }
}
