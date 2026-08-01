import { createBrowserRouter, Navigate } from 'react-router'
import Landing from '../pages/Landing'
import Login from '../pages/Login'
import Dashboard from '../pages/Dashboard'
import Overview from '../pages/Overview'
import LiveMonitoring from '../pages/LiveMonitoring'
import DetectionHistory from '../pages/DetectionHistory'
import Alerts from '../pages/Alerts'
import Settings from '../pages/Settings'
import MitigationSystem from '../pages/MitigationSystem'

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Landing,
  },
  {
    path: '/login',
    Component: Login,
  },
  {
    path: '/dashboard',
    Component: Dashboard,
    children: [
      { index: true, Component: Overview },
      { path: 'live', Component: LiveMonitoring },
      { path: 'mitigation', Component: MitigationSystem },
      { path: 'history', Component: DetectionHistory },
      { path: 'alerts', Component: Alerts },
      { path: 'settings', Component: Settings },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
])
