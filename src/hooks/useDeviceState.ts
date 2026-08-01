import { useState, useEffect } from 'react'
import type { Detection } from '../services/api'

export interface DeviceState {
  led: boolean
  sound: boolean
  water: boolean
}

export function useDeviceState(current: Detection | null, autoMode: boolean) {
  const [devices, setDevices] = useState<DeviceState>({ led: false, sound: false, water: false })
  const [pending, setPending] = useState<Partial<DeviceState>>({})

  useEffect(() => {
    if (!current) return
    if (autoMode) {
      setPending({})
      const t = setTimeout(() => {
        setDevices({
          led: current.recommendation.led,
          sound: current.recommendation.sound,
          water: current.recommendation.water,
        })
      }, 600)
      return () => clearTimeout(t)
    }
  }, [current, autoMode])

  function toggle(device: keyof DeviceState) {
    setDevices((prev) => ({ ...prev, [device]: !prev[device] }))
  }

  function activateAll() {
    setDevices({ led: true, sound: true, water: true })
  }

  function emergencyStop() {
    setDevices({ led: false, sound: false, water: false })
    setPending({})
  }

  return { devices, toggle, activateAll, emergencyStop, pending }
}
