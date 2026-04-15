// ===== SentraAI Shared Utilities =====
// Only real utility functions — no dummy data generators.

export const PURPOSES = [
  'Package Delivery', 'Meeting', 'Maintenance', 'Guest Visit',
  'Food Delivery', 'Service Request', 'Interview', 'Plumbing Repair',
  'Courier', 'House Help', 'Medical Visit', 'Construction Work',
];

export function getTrustColor(level) {
  switch (level) {
    case 'Low':    return { color: '#34d399', bg: 'rgba(52, 211, 153, 0.1)',  label: 'Low Risk' };
    case 'Medium': return { color: '#fbbf24', bg: 'rgba(251, 191, 36, 0.1)', label: 'Medium Risk' };
    case 'High':   return { color: '#f87171', bg: 'rgba(248, 113, 113, 0.1)', label: 'High Risk' };
    default:       return { color: '#94a3b8', bg: 'rgba(148, 163, 184, 0.1)', label: 'Unknown' };
  }
}

// Helper to derive trust level from a numeric score
export function getTrustLevel(score) {
  if (score >= 75) return 'Low';
  if (score >= 45) return 'Medium';
  return 'High';
}

// Helper used by VisitorEntry to compute a trust score from visit history count
export function computeTrustScore(visitCount = 0) {
  if (visitCount === 0) return { score: 50, level: 'Medium' };
  if (visitCount >= 5)  return { score: 82, level: 'Low' };
  if (visitCount >= 2)  return { score: 65, level: 'Medium' };
  return { score: 50, level: 'Medium' };
}

