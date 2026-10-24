// WOOF India - Emergency Stray Animal Connecting Portal Data

export const CITIES = [
  { 
    id: 'bengaluru', 
    name: 'Bengaluru (Karnataka)', 
    sector: 'East Bengaluru & Central Grid',
    whatsAppNetwork: 'Bengaluru Stray Animal Volunteer Network (1,450+ Active Rescuers)'
  },
  { 
    id: 'delhi', 
    name: 'Delhi NCR', 
    sector: 'South Delhi & Noida Sector',
    whatsAppNetwork: 'Delhi NCR Animal Emergency Broadcast Group (2,100+ Members)'
  },
  { 
    id: 'mumbai', 
    name: 'Mumbai (Maharashtra)', 
    sector: 'Western Suburbs Grid',
    whatsAppNetwork: 'Mumbai Stray Feeder & Rescuer Network (1,800+ Members)'
  },
  { 
    id: 'pune', 
    name: 'Pune (Maharashtra)', 
    sector: 'Pune West & Bavdhan Grid',
    whatsAppNetwork: 'Pune Animal Welfare Community Volunteers (980+ Rescuers)'
  },
  { 
    id: 'chennai', 
    name: 'Chennai (Tamil Nadu)', 
    sector: 'South Chennai Coast',
    whatsAppNetwork: 'Chennai Stray Care & Foster Network (850+ Members)'
  },
];

export const VERIFIED_CENTERS = [
  {
    id: 'cupa-blr',
    cityId: 'bengaluru',
    name: 'CUPA Trauma & Rescue Centre',
    tag: 'Hospital & Ambulance Dispatch',
    type: 'vet',
    address: 'KVAFSU Campus, Bellary Rd, Hebbal, Bengaluru',
    phone: '+91 80 2294 7307',
    ambulancePhone: '+91 80 2294 7311',
    verified: true,
    capabilities: ['Direct Ambulance Helpline', 'Night Emergency Casualty', 'Surgical Triage'],
    mapsUrl: 'https://maps.google.com/?q=CUPA+Trauma+Centre+Bengaluru'
  },
  {
    id: 'care-blr',
    cityId: 'bengaluru',
    name: "Charlie's Animal Rescue Centre (CARE)",
    tag: 'Trauma Bay & Care Sanctuary',
    type: 'shelter',
    address: 'Survey No. 124, Mittaganahalli, Kogilu, Yelahanka, Bengaluru',
    phone: '+91 94839 16052',
    ambulancePhone: '+91 94839 16052',
    verified: true,
    capabilities: ['Paraplegic Canine Care', 'Direct Foster Advice', 'Community Animal Aid'],
    mapsUrl: 'https://maps.google.com/?q=CARE+Charlies+Animal+Rescue+Centre'
  },
  {
    id: 'friendicoes-delhi',
    cityId: 'delhi',
    name: 'Friendicoes SECA Emergency Hospital',
    tag: '24/7 Emergency Casualty',
    type: 'vet',
    address: '271 & 272, Flyover Market, Defence Colony, New Delhi',
    phone: '+91 11 2432 0707',
    ambulancePhone: '+91 11 2432 0303',
    verified: true,
    capabilities: ['Emergency Ambulance Desk', 'Night Casualty OPD', 'Trauma Bay'],
    mapsUrl: 'https://maps.google.com/?q=Friendicoes+Defence+Colony'
  },
  {
    id: 'sgacc-delhi',
    cityId: 'delhi',
    name: 'Sanjay Gandhi Animal Care Centre (SGACC)',
    tag: 'Apex Animal Hospital & Sanctuary',
    type: 'shelter',
    address: 'Shivaji College Road, Raja Garden, New Delhi',
    phone: '+91 11 2544 8062',
    ambulancePhone: '+91 11 2544 7751',
    verified: true,
    capabilities: ['24-Hour Ambulance Hotline', 'Free ABC/Sterilization', 'Canine Ward'],
    mapsUrl: 'https://maps.google.com/?q=Sanjay+Gandhi+Animal+Care+Centre'
  },
  {
    id: 'ida-mumbai',
    cityId: 'mumbai',
    name: 'In Defense of Animals (IDA India) Deonar',
    tag: 'Dispensary & Emergency Ambulance',
    type: 'vet',
    address: 'Next to Deonar Abattoir, Main Gate, Govandi West, Mumbai',
    phone: '+91 93200 56585',
    ambulancePhone: '+91 93200 56581',
    verified: true,
    capabilities: ['Mobile Vet Ambulance', 'Road Accident Intake', 'Emergency Trauma Bay'],
    mapsUrl: 'https://maps.google.com/?q=In+Defense+of+Animals+Deonar+Mumbai'
  },
  {
    id: 'wsd-mumbai',
    cityId: 'mumbai',
    name: 'The Welfare of Stray Dogs (WSD)',
    tag: 'Community Care & Street Dog Aid',
    type: 'shelter',
    address: 'Adarsh Nagar, Lower Parel / Mahalaxmi, Mumbai',
    phone: '+91 22 6422 2838',
    ambulancePhone: '+91 22 6422 2838',
    verified: true,
    capabilities: ['Field Wound Dressing', 'Vaccination Vans', 'Direct Feeder Network'],
    mapsUrl: 'https://maps.google.com/?q=Welfare+of+Stray+Dogs+Mumbai'
  },
  {
    id: 'resq-pune',
    cityId: 'pune',
    name: 'RESQ Charitable Trust Trauma Center',
    tag: 'Animal Hospital & Emergency Response',
    type: 'vet',
    address: 'Plot 390, Paud Rd, near Chandani Chowk, Bavdhan, Pune',
    phone: '+91 98909 99111',
    ambulancePhone: '+91 98909 99111',
    verified: true,
    capabilities: ['Emergency Rescue Helpline', 'Critical Surgery', 'Wildlife & Street Dog ICU'],
    mapsUrl: 'https://maps.google.com/?q=RESQ+Charitable+Trust+Pune'
  },
  {
    id: 'bluecross-chennai',
    cityId: 'chennai',
    name: 'Blue Cross of India',
    tag: 'Emergency Rescue & Hospital',
    type: 'shelter',
    address: 'No 72, Velachery Road, Guindy, Chennai',
    phone: '+91 44 2235 4959',
    ambulancePhone: '+91 44 2230 0666',
    verified: true,
    capabilities: ['24-Hour Rescue Ambulance Desk', 'Sanctuary OPD', 'Emergency Sterilization'],
    mapsUrl: 'https://maps.google.com/?q=Blue+Cross+of+India+Chennai'
  }
];

export const INITIAL_TICKETS = [
  {
    id: 'RES-8492',
    cityId: 'bengaluru',
    title: 'Injured Golden-Coated Desi Indie Dog',
    species: 'Indie Dog (Desi)',
    urgency: 'critical',
    status: 'connected', // 'reported' | 'broadcasted' | 'connected' | 'help-arrived' | 'at-facility' | 'resolved'
    timestamp: '14 mins ago',
    location: '100ft Road, near Indiranagar Metro Pillar 42, Bengaluru',
    lat: 12.9784,
    lng: 77.6408,
    landmark: 'Opposite Toit Brewpub, footpath curb',
    reportedBy: 'Kavita Sundaram (Citizen Finder)',
    reporterPhone: '+91 98450 12345',
    notes: 'Hit by speeding auto-rickshaw. Dog dragged itself onto pavement; left hind leg fractured. Citizen staying with animal, needs volunteer transport to CUPA Hebbal.',
    photo: 'https://images.unsplash.com/photo-1544568100-847a948585b9?auto=format&fit=crop&w=600&q=80',
    connectedResponder: {
      name: 'Rajesh Kumar (Volunteer Rescuer)',
      role: 'Community First Responder with Bike Carrier',
      phone: '+91 98860 99881',
      eta: '7 mins away',
      action: 'En route with muzzle & blanket to transport dog to CUPA'
    },
    nearestFacility: {
      name: 'CUPA Trauma & Rescue Centre',
      phone: '+91 80 2294 7311',
      distance: '2.4 km'
    },
    timeline: [
      { time: '10:18 PM', event: 'Volunteer Rajesh Kumar connected via WhatsApp broadcast; heading with transport carrier', actor: 'Rajesh Kumar' },
      { time: '10:14 PM', event: 'Distress card shared to Bengaluru Stray Care WhatsApp Group', actor: 'WOOF Connector' },
      { time: '10:04 PM', event: 'Citizen Kavita logged distress call & requested nearest ambulance contact', actor: 'Kavita Sundaram' }
    ]
  },
  {
    id: 'RES-8495',
    cityId: 'delhi',
    title: 'Gully Kitten Trapped Inside Storm Drain Basin',
    species: 'Stray Kitten',
    urgency: 'severe',
    status: 'broadcasted',
    timestamp: '28 mins ago',
    location: 'Defence Colony Flyover Market, Block A, New Delhi',
    lat: 28.5729,
    lng: 77.2295,
    landmark: 'Under the central staircase pillar, near electrical box',
    reportedBy: 'Aman Verma (Citizen)',
    reporterPhone: '+91 98111 44552',
    notes: 'Approx 4-week-old calico kitten trapped in iron grating. Citizen needs someone with a crowbar/pliers or Friendicoes volunteer.',
    photo: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=600&q=80',
    connectedResponder: {
      name: 'Sneha Chawla (Local Feeder)',
      role: 'Neighbourhood Animal Feeder',
      phone: '+91 98100 23411',
      eta: '12 mins away',
      action: 'Connecting with nearby Friendicoes ambulance driver'
    },
    nearestFacility: {
      name: 'Friendicoes SECA Emergency Hospital',
      phone: '+91 11 2432 0303',
      distance: '1.8 km'
    },
    timeline: [
      { time: '09:56 PM', event: 'Feeder Sneha saw distress broadcast on Delhi NCR WhatsApp Network', actor: 'Sneha Chawla' },
      { time: '09:42 PM', event: 'Citizen Aman submitted distress coordinates & photos on portal', actor: 'Aman Verma' }
    ]
  },
  {
    id: 'RES-8488',
    cityId: 'mumbai',
    title: 'Desi Dog with Severe Head Maggot Cavity',
    species: 'Indie Dog (Desi)',
    urgency: 'critical',
    status: 'at-facility',
    timestamp: '1 hour ago',
    location: 'Carter Road Promenade, Bandra West, Mumbai',
    lat: 19.0607,
    lng: 72.8258,
    landmark: 'Near CCD exit, seawall bench',
    reportedBy: 'Pooja Bhatt (Citizen)',
    reporterPhone: '+91 98200 67890',
    notes: 'Fly strike cavity behind right ear. Citizen and local feeder connected with IDA ambulance; dog transported safely.',
    photo: 'https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?auto=format&fit=crop&w=600&q=80',
    connectedResponder: {
      name: 'IDA India Mobile Ambulance Unit',
      role: 'Verified NGO Ambulance Partner',
      phone: '+91 93200 56581',
      eta: 'Admitted',
      action: 'Admitted into Deonar surgical dressing ward'
    },
    nearestFacility: {
      name: 'In Defense of Animals (IDA) Deonar',
      phone: '+91 93200 56585',
      distance: '3.2 km'
    },
    timeline: [
      { time: '09:30 PM', event: 'Admitted to IDA Deonar OPD; maggots extracted and wound dressed', actor: 'Dr. Patil (IDA)' },
      { time: '08:50 PM', event: 'Bandra Volunteer Team helped secure the dog with leash for ambulance', actor: 'Community Rescuers' },
      { time: '08:45 PM', event: 'Citizen Pooja generated WOOF WhatsApp card and shared to Mumbai Feeder Group', actor: 'Pooja Bhatt' }
    ]
  }
];

export const FIRST_AID_GUIDES = {
  hitAndRun: {
    title: 'Hit-and-Run: What to Do While Waiting for Help',
    badge: 'Accident Triage',
    icon: 'car_crash',
    steps: [
      '1. Create a Traffic Safety Perimeter: Do not stand in moving traffic. Place a hazard cone, parked two-wheeler, or tree branch 20ft ahead of the animal to redirect vehicles.',
      '2. Muzzle Gently to Prevent Pain Bites: In severe trauma, even gentle street dogs will instinctively bite handlers. Wrap a soft dupatta, cloth leash, or scarf around the snout (never muzzle if vomiting or gasping).',
      '3. Improvise a Stretcher: Slide a rigid plywood sheet, cardboard box base, heavy bedsheet, or car floor mat underneath. Lift together without bending the animal’s spine.',
      '4. Direct Pressure on Bleeding: Press firmly with a clean cotton towel. Do NOT tie wire, rubber bands, or tight tourniquets.',
      '5. Connect with Nearest Hospital: Call the closest emergency clinic from the WOOF directory so their medical casualty team is prepped.'
    ]
  },
  maggotWound: {
    title: 'Maggot Wound (Myiasis): Field First Aid',
    badge: 'Wound Protocol',
    icon: 'healing',
    steps: [
      '1. NEVER Pour Kerosene or Petrol: Traditional street myths recommend kerosene, which causes fatal chemical burns, organ damage, and unbearable agony.',
      '2. Safely Stifle Maggots: Pure veterinary turpentine oil (a small drop on cotton) or Negasunt powder forces maggots out of deep tissue. Keep away from eyes & tongue.',
      '3. Pluck Visible Maggots: Use tweezers to remove surface maggots. Never gouge deeply into tissue.',
      '4. Flush with Dilute Betadine: Clean the cavity with diluted Betadine (Povidone-Iodine mixed with clean water in 1:4 ratio).',
      '5. Spray Fly-Repellent: Coat area with Topicure, Scavon, or Lorexane spray so flies cannot lay new eggs while you connect with an NGO or local feeder.'
    ]
  },
  kittens: {
    title: 'Found Stray Kittens: Don’t "Kit-Nap"',
    badge: 'Neonatal Care',
    icon: 'pets',
    steps: [
      '1. Observe from 25-30 Feet: Mother cats forage for food for up to 4-6 hours. If the kittens are warm and asleep with rounded bellies, the mother is around.',
      '2. Check for Immediate Danger: Only intervene immediately if kittens are in a drain, soaking in rain, or attacked by street animals.',
      '3. Warmth Before Milk: Hypothermic kittens cannot digest milk. Place in a cardboard box with a warm towel-wrapped bottle.',
      '4. NEVER Give Cow or Buffalo Milk: Causes fatal diarrhea and dehydration. Use kitten milk replacer (KMR) or boiled goat milk via feeding syringe.',
      '5. Connect with Local Fosterers: Post on the WOOF community board to find neonatal fosterers with incubators in your city.'
    ]
  },
  heatstroke: {
    title: 'Summer Heatstroke in Street Animals',
    badge: 'Seasonal Crisis',
    icon: 'thermostat',
    steps: [
      '1. Recognize Signs: Violent panting, dark red or purple gums, glassy stare, thick drool, trembling legs, collapse.',
      '2. Move to Shade Instantly: Shift animal into a building portico, basement, or under tree shade.',
      '3. Cool with Normal Water: Douse the paws, belly, groin, and neck with normal tap water. NEVER use freezing ice water (causes dangerous vascular shock).',
      '4. Offer ORS Water: Provide clean water with Electral / ORS or a pinch of sugar & salt in small sips. Never force liquids into an unconscious animal.',
      '5. Contact Nearby Feeder / Rescuer: Connect via the WOOF community board for veterinary electrolyte injections if the animal remains limp.'
    ]
  }
};
