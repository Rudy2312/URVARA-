import { useState, useEffect, useCallback, useRef } from 'react'
import { generateDetection, SEED_DETECTIONS, type Detection } from '../services/api'

export function useDetectionFeed() {
  const [history, setHistory] = useState<Detection[]>([...SEED_DETECTIONS])
  const [current, setCurrent] = useState<Detection | null>(null)
  const [autoMode, setAutoMode] = useState(true)
  /** When YOLO webcam is active, pause the simulated detection interval */
  const [yoloActive, setYoloActive] = useState(false)
  const lastYoloIdRef = useRef<string | null>(null)

  const triggerDetection = useCallback(() => {
    const det = generateDetection()
    setCurrent(det)
    setHistory((prev) => [det, ...prev])
  }, [])

  const applyYoloDetection = useCallback((det: Detection) => {
    if (lastYoloIdRef.current === det.id) return
    lastYoloIdRef.current = det.id
    setCurrent(det)
    setHistory((prev) => [det, ...prev])
    setYoloActive(true)
  }, [])

  useEffect(() => {
    if (yoloActive) return
    const interval = setInterval(triggerDetection, 9000)
    return () => clearInterval(interval)
  }, [triggerDetection, yoloActive])

  return {
    current,
    history,
    autoMode,
    setAutoMode,
    triggerDetection,
    applyYoloDetection,
    yoloActive,
    setYoloActive,
  }
}
