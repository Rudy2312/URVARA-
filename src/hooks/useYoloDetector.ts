import { useCallback, useEffect, useRef, useState, type RefObject } from 'react'
import * as cocoSsd from '@tensorflow-models/coco-ssd'
import '@tensorflow/tfjs'
import {
  analyzeAnimal,
  DETECTABLE_CLASSES,
  pickPrimary,
  toDetection,
  type AnalyzedAnimal,
  type RawBox,
} from '../services/animalDetector'
import type { Detection } from '../services/api'

export type DetectorStatus =
  | 'idle'
  | 'requesting'
  | 'loading-model'
  | 'running'
  | 'denied'
  | 'error'
  | 'stopped'

export interface YoloDetectorState {
  status: DetectorStatus
  error: string | null
  fps: number
  animals: AnalyzedAnimal[]
  primary: AnalyzedAnimal | null
  modelReady: boolean
  cameraActive: boolean
}

interface UseYoloDetectorOptions {
  /** Called when a new/changed animal detection should update the dashboard */
  onDetection?: (detection: Detection) => void
  /** Min ms between dashboard updates for the same species */
  reportIntervalMs?: number
  enabled?: boolean
}

const EMPTY: YoloDetectorState = {
  status: 'idle',
  error: null,
  fps: 0,
  animals: [],
  primary: null,
  modelReady: false,
  cameraActive: false,
}

export function useYoloDetector(
  videoRef: RefObject<HTMLVideoElement | null>,
  options: UseYoloDetectorOptions = {},
) {
  const { onDetection, reportIntervalMs = 2500, enabled = true } = options

  const [state, setState] = useState<YoloDetectorState>(EMPTY)
  const modelRef = useRef<cocoSsd.ObjectDetection | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const rafRef = useRef<number>(0)
  const runningRef = useRef(false)
  const lastReportRef = useRef<{ species: string; at: number }>({ species: '', at: 0 })
  const onDetectionRef = useRef(onDetection)
  onDetectionRef.current = onDetection

  const stopCamera = useCallback(() => {
    runningRef.current = false
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    rafRef.current = 0
    streamRef.current?.getTracks().forEach((t) => t.stop())
    streamRef.current = null
    const video = videoRef.current
    if (video) {
      video.srcObject = null
    }
    setState((s) => ({
      ...s,
      status: 'stopped',
      cameraActive: false,
      animals: [],
      primary: null,
      fps: 0,
    }))
  }, [videoRef])

  const detectLoop = useCallback(async () => {
    const video = videoRef.current
    const model = modelRef.current
    if (!runningRef.current || !video || !model) return

    if (video.readyState < 2 || video.videoWidth === 0) {
      rafRef.current = requestAnimationFrame(() => {
        void detectLoop()
      })
      return
    }

    const t0 = performance.now()
    try {
      const predictions = await model.detect(video)
      const frameW = video.videoWidth
      const frameH = video.videoHeight

      const boxes: RawBox[] = predictions
        .filter((p) => DETECTABLE_CLASSES.has(p.class.toLowerCase()) && p.score >= 0.45)
        .map((p) => ({
          class: p.class.toLowerCase(),
          score: p.score,
          bbox: p.bbox as [number, number, number, number],
        }))

      const animals = boxes
        .map((b) => analyzeAnimal(b, frameW, frameH))
        .filter((a): a is AnalyzedAnimal => a !== null)

      const primary = pickPrimary(animals)
      const fps = Math.round(1000 / Math.max(1, performance.now() - t0))

      setState((s) => ({
        ...s,
        status: 'running',
        animals,
        primary,
        fps,
        cameraActive: true,
        modelReady: true,
        error: null,
      }))

      if (primary && onDetectionRef.current) {
        const now = Date.now()
        const changed =
          primary.species !== lastReportRef.current.species ||
          now - lastReportRef.current.at >= reportIntervalMs
        if (changed) {
          lastReportRef.current = { species: primary.species, at: now }
          onDetectionRef.current(toDetection(primary))
        }
      }
    } catch {
      // Keep looping through transient inference errors
    }

    if (runningRef.current) {
      rafRef.current = requestAnimationFrame(() => {
        void detectLoop()
      })
    }
  }, [reportIntervalMs, videoRef])

  const start = useCallback(async () => {
    if (runningRef.current) return

    setState((s) => ({ ...s, status: 'requesting', error: null }))

    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error('Camera API not available in this browser.')
      }

      const isSecureContext =
        typeof window !== 'undefined' &&
        (window.isSecureContext ||
          window.location.hostname === 'localhost' ||
          window.location.hostname === '127.0.0.1')

      if (!isSecureContext) {
        throw new Error('Camera access requires a secure connection. Open this app from https:// or http://localhost.')
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user',
          width: { ideal: 1280 },
          height: { ideal: 720 },
          frameRate: { ideal: 30 },
        },
        audio: false,
      })
      streamRef.current = stream

      const video = videoRef.current
      if (!video) {
        stream.getTracks().forEach((t) => t.stop())
        throw new Error('Video element not ready.')
      }

      video.srcObject = stream
      video.muted = true
      video.playsInline = true
      video.autoplay = true

      try {
        await video.play()
      } catch (playError) {
        const message = playError instanceof Error ? playError.message : 'Video playback failed.'
        throw new Error(`Camera started but video playback failed: ${message}`)
      }

      setState((s) => ({
        ...s,
        status: 'loading-model',
        cameraActive: true,
        error: null,
      }))

      if (!modelRef.current) {
        modelRef.current = await cocoSsd.load({ base: 'lite_mobilenet_v2' })
      }

      runningRef.current = true
      setState((s) => ({
        ...s,
        status: 'running',
        modelReady: true,
        cameraActive: true,
      }))
      rafRef.current = requestAnimationFrame(() => {
        void detectLoop()
      })
    } catch (err) {
      streamRef.current?.getTracks().forEach((t) => t.stop())
      streamRef.current = null
      const denied =
        err instanceof DOMException &&
        (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError')
      setState({
        ...EMPTY,
        status: denied ? 'denied' : 'error',
        error: denied
          ? 'Camera permission denied. Allow camera access to start YOLO detection.'
          : err instanceof Error
            ? err.message
            : 'Failed to start camera detector.',
      })
    }
  }, [detectLoop, videoRef])

  useEffect(() => {
    if (!enabled) {
      stopCamera()
      return
    }
    return () => {
      stopCamera()
    }
  }, [enabled, stopCamera])

  return {
    ...state,
    start,
    stop: stopCamera,
  }
}
