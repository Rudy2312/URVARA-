import SimulationProvider, { useSimulation } from '../simulation/SimulationProvider'
import FarmScene from './simulation/3d/FarmScene'
import DashboardOverlay from './simulation/ui/DashboardOverlay'
import ArchitectureView from './simulation/ui/ArchitectureView'

function SimulationContent() {
  const { viewMode } = useSimulation()

  return (
    <div className="w-full h-full relative bg-[#070d0a] text-white select-none overflow-hidden">
      {viewMode === 'farm' ? (
        <div className="w-full h-full relative">
          <div className="absolute inset-0 z-10">
            <FarmScene />
          </div>
          <div className="absolute inset-0 z-20 pointer-events-none">
            <DashboardOverlay />
          </div>
        </div>
      ) : (
        <div className="w-full h-full p-4 z-20 relative animate-slide-fade">
          <ArchitectureView />
        </div>
      )}
    </div>
  )
}

export default function FarmSimulation() {
  return (
    <SimulationProvider embedded>
      <div className="relative w-full h-[min(720px,85vh)] min-h-[520px] rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
        <SimulationContent />
      </div>
    </SimulationProvider>
  )
}
