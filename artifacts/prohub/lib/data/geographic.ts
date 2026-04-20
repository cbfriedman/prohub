// US Geographic Data for Campaign Targeting

export const US_REGIONS = [
  { value: 'west', label: 'West', states: ['CA', 'OR', 'WA', 'NV', 'AZ', 'UT', 'CO', 'NM', 'WY', 'MT', 'ID', 'AK', 'HI'] },
  { value: 'midwest', label: 'Midwest', states: ['IL', 'IN', 'IA', 'KS', 'MI', 'MN', 'MO', 'NE', 'ND', 'OH', 'SD', 'WI'] },
  { value: 'northeast', label: 'Northeast', states: ['CT', 'DE', 'ME', 'MD', 'MA', 'NH', 'NJ', 'NY', 'PA', 'RI', 'VT', 'DC'] },
  { value: 'south', label: 'South', states: ['AL', 'AR', 'FL', 'GA', 'KY', 'LA', 'MS', 'NC', 'OK', 'SC', 'TN', 'TX', 'VA', 'WV'] },
]

export const US_STATES = [
  { value: 'AL', label: 'Alabama', region: 'south' },
  { value: 'AK', label: 'Alaska', region: 'west' },
  { value: 'AZ', label: 'Arizona', region: 'west' },
  { value: 'AR', label: 'Arkansas', region: 'south' },
  { value: 'CA', label: 'California', region: 'west' },
  { value: 'CO', label: 'Colorado', region: 'west' },
  { value: 'CT', label: 'Connecticut', region: 'northeast' },
  { value: 'DE', label: 'Delaware', region: 'northeast' },
  { value: 'DC', label: 'District of Columbia', region: 'northeast' },
  { value: 'FL', label: 'Florida', region: 'south' },
  { value: 'GA', label: 'Georgia', region: 'south' },
  { value: 'HI', label: 'Hawaii', region: 'west' },
  { value: 'ID', label: 'Idaho', region: 'west' },
  { value: 'IL', label: 'Illinois', region: 'midwest' },
  { value: 'IN', label: 'Indiana', region: 'midwest' },
  { value: 'IA', label: 'Iowa', region: 'midwest' },
  { value: 'KS', label: 'Kansas', region: 'midwest' },
  { value: 'KY', label: 'Kentucky', region: 'south' },
  { value: 'LA', label: 'Louisiana', region: 'south' },
  { value: 'ME', label: 'Maine', region: 'northeast' },
  { value: 'MD', label: 'Maryland', region: 'northeast' },
  { value: 'MA', label: 'Massachusetts', region: 'northeast' },
  { value: 'MI', label: 'Michigan', region: 'midwest' },
  { value: 'MN', label: 'Minnesota', region: 'midwest' },
  { value: 'MS', label: 'Mississippi', region: 'south' },
  { value: 'MO', label: 'Missouri', region: 'midwest' },
  { value: 'MT', label: 'Montana', region: 'west' },
  { value: 'NE', label: 'Nebraska', region: 'midwest' },
  { value: 'NV', label: 'Nevada', region: 'west' },
  { value: 'NH', label: 'New Hampshire', region: 'northeast' },
  { value: 'NJ', label: 'New Jersey', region: 'northeast' },
  { value: 'NM', label: 'New Mexico', region: 'west' },
  { value: 'NY', label: 'New York', region: 'northeast' },
  { value: 'NC', label: 'North Carolina', region: 'south' },
  { value: 'ND', label: 'North Dakota', region: 'midwest' },
  { value: 'OH', label: 'Ohio', region: 'midwest' },
  { value: 'OK', label: 'Oklahoma', region: 'south' },
  { value: 'OR', label: 'Oregon', region: 'west' },
  { value: 'PA', label: 'Pennsylvania', region: 'northeast' },
  { value: 'RI', label: 'Rhode Island', region: 'northeast' },
  { value: 'SC', label: 'South Carolina', region: 'south' },
  { value: 'SD', label: 'South Dakota', region: 'midwest' },
  { value: 'TN', label: 'Tennessee', region: 'south' },
  { value: 'TX', label: 'Texas', region: 'south' },
  { value: 'UT', label: 'Utah', region: 'west' },
  { value: 'VT', label: 'Vermont', region: 'northeast' },
  { value: 'VA', label: 'Virginia', region: 'south' },
  { value: 'WA', label: 'Washington', region: 'west' },
  { value: 'WV', label: 'West Virginia', region: 'south' },
  { value: 'WI', label: 'Wisconsin', region: 'midwest' },
  { value: 'WY', label: 'Wyoming', region: 'west' },
  // Territories
  { value: 'PR', label: 'Puerto Rico', region: 'south' },
  { value: 'GU', label: 'Guam', region: 'west' },
  { value: 'VI', label: 'US Virgin Islands', region: 'south' },
  { value: 'AS', label: 'American Samoa', region: 'west' },
  { value: 'MP', label: 'Northern Mariana Islands', region: 'west' },
]

// Major counties/localities by state
export const US_COUNTIES: Record<string, { value: string; label: string }[]> = {
  'CA': [
    { value: 'bay-area', label: 'San Francisco Bay Area' },
    { value: 'los-angeles', label: 'Los Angeles County' },
    { value: 'san-diego', label: 'San Diego County' },
    { value: 'orange', label: 'Orange County' },
    { value: 'riverside', label: 'Riverside County' },
    { value: 'san-bernardino', label: 'San Bernardino County' },
    { value: 'santa-clara', label: 'Santa Clara County' },
    { value: 'alameda', label: 'Alameda County' },
    { value: 'sacramento', label: 'Sacramento County' },
    { value: 'san-francisco', label: 'San Francisco County' },
    { value: 'contra-costa', label: 'Contra Costa County' },
    { value: 'fresno', label: 'Fresno County' },
    { value: 'kern', label: 'Kern County' },
    { value: 'san-mateo', label: 'San Mateo County' },
    { value: 'ventura', label: 'Ventura County' },
  ],
  'TX': [
    { value: 'harris', label: 'Harris County (Houston)' },
    { value: 'dallas', label: 'Dallas County' },
    { value: 'tarrant', label: 'Tarrant County (Fort Worth)' },
    { value: 'bexar', label: 'Bexar County (San Antonio)' },
    { value: 'travis', label: 'Travis County (Austin)' },
    { value: 'collin', label: 'Collin County' },
    { value: 'denton', label: 'Denton County' },
    { value: 'hidalgo', label: 'Hidalgo County' },
    { value: 'el-paso', label: 'El Paso County' },
    { value: 'fort-bend', label: 'Fort Bend County' },
  ],
  'NY': [
    { value: 'kings', label: 'Kings County (Brooklyn)' },
    { value: 'queens', label: 'Queens County' },
    { value: 'new-york', label: 'New York County (Manhattan)' },
    { value: 'suffolk', label: 'Suffolk County' },
    { value: 'bronx', label: 'Bronx County' },
    { value: 'nassau', label: 'Nassau County' },
    { value: 'westchester', label: 'Westchester County' },
    { value: 'erie', label: 'Erie County (Buffalo)' },
    { value: 'monroe', label: 'Monroe County (Rochester)' },
    { value: 'richmond', label: 'Richmond County (Staten Island)' },
  ],
  'FL': [
    { value: 'miami-dade', label: 'Miami-Dade County' },
    { value: 'broward', label: 'Broward County' },
    { value: 'palm-beach', label: 'Palm Beach County' },
    { value: 'hillsborough', label: 'Hillsborough County (Tampa)' },
    { value: 'orange', label: 'Orange County (Orlando)' },
    { value: 'pinellas', label: 'Pinellas County' },
    { value: 'duval', label: 'Duval County (Jacksonville)' },
    { value: 'lee', label: 'Lee County' },
    { value: 'polk', label: 'Polk County' },
    { value: 'brevard', label: 'Brevard County' },
  ],
  'IL': [
    { value: 'cook', label: 'Cook County (Chicago)' },
    { value: 'dupage', label: 'DuPage County' },
    { value: 'lake', label: 'Lake County' },
    { value: 'will', label: 'Will County' },
    { value: 'kane', label: 'Kane County' },
    { value: 'mchenry', label: 'McHenry County' },
    { value: 'winnebago', label: 'Winnebago County' },
    { value: 'madison', label: 'Madison County' },
    { value: 'st-clair', label: 'St. Clair County' },
  ],
  'PA': [
    { value: 'philadelphia', label: 'Philadelphia County' },
    { value: 'allegheny', label: 'Allegheny County (Pittsburgh)' },
    { value: 'montgomery', label: 'Montgomery County' },
    { value: 'bucks', label: 'Bucks County' },
    { value: 'delaware', label: 'Delaware County' },
    { value: 'lancaster', label: 'Lancaster County' },
    { value: 'chester', label: 'Chester County' },
    { value: 'york', label: 'York County' },
  ],
  'OH': [
    { value: 'cuyahoga', label: 'Cuyahoga County (Cleveland)' },
    { value: 'franklin', label: 'Franklin County (Columbus)' },
    { value: 'hamilton', label: 'Hamilton County (Cincinnati)' },
    { value: 'summit', label: 'Summit County (Akron)' },
    { value: 'montgomery', label: 'Montgomery County (Dayton)' },
    { value: 'lucas', label: 'Lucas County (Toledo)' },
    { value: 'butler', label: 'Butler County' },
    { value: 'stark', label: 'Stark County' },
  ],
  'GA': [
    { value: 'fulton', label: 'Fulton County (Atlanta)' },
    { value: 'gwinnett', label: 'Gwinnett County' },
    { value: 'cobb', label: 'Cobb County' },
    { value: 'dekalb', label: 'DeKalb County' },
    { value: 'chatham', label: 'Chatham County (Savannah)' },
    { value: 'clayton', label: 'Clayton County' },
    { value: 'cherokee', label: 'Cherokee County' },
  ],
  'NC': [
    { value: 'mecklenburg', label: 'Mecklenburg County (Charlotte)' },
    { value: 'wake', label: 'Wake County (Raleigh)' },
    { value: 'guilford', label: 'Guilford County' },
    { value: 'forsyth', label: 'Forsyth County' },
    { value: 'durham', label: 'Durham County' },
    { value: 'cumberland', label: 'Cumberland County' },
    { value: 'buncombe', label: 'Buncombe County (Asheville)' },
  ],
  'MI': [
    { value: 'wayne', label: 'Wayne County (Detroit)' },
    { value: 'oakland', label: 'Oakland County' },
    { value: 'macomb', label: 'Macomb County' },
    { value: 'kent', label: 'Kent County (Grand Rapids)' },
    { value: 'genesee', label: 'Genesee County (Flint)' },
    { value: 'washtenaw', label: 'Washtenaw County (Ann Arbor)' },
  ],
  'AZ': [
    { value: 'maricopa', label: 'Maricopa County (Phoenix)' },
    { value: 'pima', label: 'Pima County (Tucson)' },
    { value: 'pinal', label: 'Pinal County' },
    { value: 'yavapai', label: 'Yavapai County' },
    { value: 'mohave', label: 'Mohave County' },
  ],
  'WA': [
    { value: 'king', label: 'King County (Seattle)' },
    { value: 'pierce', label: 'Pierce County (Tacoma)' },
    { value: 'snohomish', label: 'Snohomish County' },
    { value: 'spokane', label: 'Spokane County' },
    { value: 'clark', label: 'Clark County' },
  ],
  'MA': [
    { value: 'middlesex', label: 'Middlesex County' },
    { value: 'suffolk', label: 'Suffolk County (Boston)' },
    { value: 'essex', label: 'Essex County' },
    { value: 'worcester', label: 'Worcester County' },
    { value: 'norfolk', label: 'Norfolk County' },
  ],
  'CO': [
    { value: 'denver', label: 'Denver County' },
    { value: 'el-paso', label: 'El Paso County (Colorado Springs)' },
    { value: 'arapahoe', label: 'Arapahoe County' },
    { value: 'jefferson', label: 'Jefferson County' },
    { value: 'adams', label: 'Adams County' },
    { value: 'douglas', label: 'Douglas County' },
    { value: 'boulder', label: 'Boulder County' },
  ],
  'NJ': [
    { value: 'bergen', label: 'Bergen County' },
    { value: 'middlesex', label: 'Middlesex County' },
    { value: 'essex', label: 'Essex County (Newark)' },
    { value: 'hudson', label: 'Hudson County (Jersey City)' },
    { value: 'monmouth', label: 'Monmouth County' },
    { value: 'ocean', label: 'Ocean County' },
    { value: 'union', label: 'Union County' },
    { value: 'passaic', label: 'Passaic County' },
    { value: 'camden', label: 'Camden County' },
  ],
}

// Geographic coverage types for campaign targeting
export const GEOGRAPHIC_COVERAGE_OPTIONS = [
  { 
    value: 'international', 
    label: 'International',
    description: 'Reach audiences worldwide with global publications'
  },
  { 
    value: 'national', 
    label: 'National (US)',
    description: 'Nationwide coverage across the United States'
  },
  { 
    value: 'regional', 
    label: 'Regional',
    description: 'Target specific US regions (West, Midwest, Northeast, South)'
  },
  { 
    value: 'state', 
    label: 'State',
    description: 'Target specific US states and territories'
  },
  { 
    value: 'local', 
    label: 'Local',
    description: 'Target specific counties and localities'
  },
]

// Helper function to get states by region
export function getStatesByRegion(regionValue: string): typeof US_STATES {
  return US_STATES.filter(state => state.region === regionValue)
}

// Helper function to get counties by state
export function getCountiesByState(stateValue: string): { value: string; label: string }[] {
  return US_COUNTIES[stateValue] || []
}

// Helper function to get region label
export function getRegionLabel(regionValue: string): string {
  return US_REGIONS.find(r => r.value === regionValue)?.label || regionValue
}

// Helper function to get state label
export function getStateLabel(stateValue: string): string {
  return US_STATES.find(s => s.value === stateValue)?.label || stateValue
}
