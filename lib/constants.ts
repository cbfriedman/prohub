// Markup percentage for client pricing
export const MARKUP_PERCENTAGE = 0.20 // 20%

// Admin access password
export const ADMIN_PASSWORD = 'prhub2026'

// Apply markup to a rate
export function applyMarkup(rate: number, roundToWhole: boolean = false): number {
  const result = rate * (1 + MARKUP_PERCENTAGE)
  return roundToWhole ? Math.round(result) : Math.round(result * 100) / 100
}

// Calculate CPM from rate and circulation
export function calculateCpm(rate: number, circulation: number): number {
  if (circulation === 0) return 0
  return (rate / circulation) * 1000
}

// Format currency
export function formatCurrency(amount: number, decimals: number = 0): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(amount)
}

// Format circulation for display
export function formatCirculation(circulation: number): string {
  if (circulation >= 1000000) {
    return `${(circulation / 1000000).toFixed(1)}M`
  } else if (circulation >= 1000) {
    return `${Math.round(circulation / 1000)}K`
  }
  return circulation.toString()
}

// Region and locality mappings
export const REGIONS = {
  west: 'West',
  midwest: 'Midwest',
  northeast: 'Northeast',
  south: 'South',
} as const

export const LOCALITIES = {
  west: {
    'bay-area': 'Bay Area',
    'los-angeles': 'Los Angeles',
    'san-diego': 'San Diego',
    'seattle': 'Seattle',
    'denver': 'Denver',
    'portland': 'Portland',
    'phoenix': 'Phoenix',
    'las-vegas': 'Las Vegas',
  },
  midwest: {
    'chicago': 'Chicago',
    'detroit': 'Detroit',
    'minneapolis': 'Minneapolis',
    'cleveland': 'Cleveland',
    'columbus': 'Columbus',
    'milwaukee': 'Milwaukee',
    'indianapolis': 'Indianapolis',
    'kansas-city': 'Kansas City',
    'st-louis': 'St. Louis',
  },
  northeast: {
    'boston': 'Boston',
    'philadelphia': 'Philadelphia',
    'pittsburgh': 'Pittsburgh',
    'hartford': 'Hartford',
    'newark': 'Newark',
    'washington-dc': 'Washington DC',
    'baltimore': 'Baltimore',
  },
  south: {
    'houston': 'Houston',
    'dallas': 'Dallas',
    'austin': 'Austin',
    'san-antonio': 'San Antonio',
    'atlanta': 'Atlanta',
    'miami': 'Miami',
    'tampa': 'Tampa',
    'orlando': 'Orlando',
    'charlotte': 'Charlotte',
    'raleigh': 'Raleigh',
    'new-orleans': 'New Orleans',
    'sacramento': 'Sacramento',
  },
} as const

// Focus category colors
export const FOCUS_COLORS = {
  tech: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  business: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200',
  entertainment: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  general: 'bg-slate-100 text-slate-800 dark:bg-slate-900 dark:text-slate-200',
  science: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200',
  startup: 'bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-200',
} as const

// Geographic badge colors
export const GEOGRAPHIC_COLORS = {
  nationwide: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  regional: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
  local: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200',
  international: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
} as const

// Campaign status colors
export const STATUS_COLORS = {
  draft: 'bg-slate-100 text-slate-800',
  active: 'bg-blue-100 text-blue-800',
  submitted: 'bg-amber-100 text-amber-800',
  published: 'bg-green-100 text-green-800',
} as const
