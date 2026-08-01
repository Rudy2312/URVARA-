import { useState, useEffect } from 'react'
import { SEED_ALERTS, type Alert } from '../services/api'
import type { Detection } from '../services/api'

export function useAlerts(current: Detection | null) {
  const [alerts, setAlerts] = useState<Alert[]>([...SEED_ALERTS])

  useEffect(() => {
    if (!current) return
    const alert: Alert = {
      id: current.id,
      timestamp: current.timestamp,
      species: current.species,
      confidence: current.confidence,
      risk: current.risk,
      boundary: current.boundary,
      recommendation: current.actionTaken,
      read: false,
    }
    setAlerts((prev) => [alert, ...prev])
  }, [current])

  function markRead(id: string) {
    setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, read: true } : a)))
  }

  function markAllRead() {
    setAlerts((prev) => prev.map((a) => ({ ...a, read: true })))
  }

  const unreadCount = alerts.filter((a) => !a.read).length

  return { alerts, markRead, markAllRead, unreadCount }
}
