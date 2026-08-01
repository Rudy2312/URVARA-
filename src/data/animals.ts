import { ScenarioConfig } from '../types/simulation';

export const SCENARIOS: Record<string, ScenarioConfig> = {
  cow: {
    species: 'cow',
    name: 'Cow (Stray Dairy)',
    speed: 1.0,
    confidence: 96,
    initialRisk: 15,
    preferredResponse: 'LED + Sound',
    description: 'Slow-moving grazer. Moderately reactive to strobe lights and loud frequencies. Responds to speaker alarms.'
  },
  goat: {
    species: 'goat',
    name: 'Goat (Agile Herbivore)',
    speed: 1.6,
    confidence: 93,
    initialRisk: 22,
    preferredResponse: 'Sound (High Frequency)',
    description: 'Highly agile, erratic movement. Very reactive to sound, easily spooked, but quick to breach boundaries.'
  },
  pig: {
    species: 'pig',
    name: 'Wild Pig (Destructive)',
    speed: 1.3,
    confidence: 91,
    initialRisk: 30,
    preferredResponse: 'LED + Sound + Sprinkler Spray',
    description: 'Heavy crop damage risk. Stubborn and highly aggressive. Light and audio might fail, usually requires sprinkler spray escalation.'
  },
  buffalo: {
    species: 'buffalo',
    name: 'Buffalo (Heavy Intruder)',
    speed: 0.7,
    confidence: 95,
    initialRisk: 25,
    preferredResponse: 'Sound + Sprinkler Escalation',
    description: 'Slow, heavy footprint. Extremely stubborn. Highly immune to LED strobes, acoustic alarms are moderately effective, but water spray resolves breaches best.'
  }
};

export default SCENARIOS;
