import { haversineKm } from './geo';

export const PROBLEMS = [
  {
    id: 'injured',
    label: 'Injured animal or accident',
    urgent: true,
    prefer: ['veterinary'],
    hint: 'Prioritises veterinary facilities. This is not a diagnosis.',
  },
  {
    id: 'bleeding',
    label: 'Severe bleeding or suspected fracture',
    urgent: true,
    prefer: ['veterinary'],
    hint: 'Prioritises veterinary facilities. Call ahead if a number is listed.',
  },
  {
    id: 'breathing',
    label: 'Difficulty breathing or unconsciousness',
    urgent: true,
    prefer: ['veterinary'],
    hint: 'Seek urgent veterinary care. WOOF cannot confirm that a clinic will accept the case.',
  },
  {
    id: 'sick-pet',
    label: 'Sick or injured pet',
    urgent: false,
    prefer: ['veterinary'],
    hint: 'Prioritises veterinary hospitals and clinics.',
  },
  {
    id: 'abandoned',
    label: 'Abandoned puppy or kitten',
    urgent: false,
    prefer: ['shelter', 'veterinary'],
    hint: 'Shows shelters first, then veterinary facilities.',
  },
  {
    id: 'stray',
    label: 'Stray animal needing rescue',
    urgent: false,
    prefer: ['shelter', 'veterinary'],
    hint: 'Shows rescue-related OSM listings near you.',
  },
  {
    id: 'shelter',
    label: 'Animal needing shelter or relocation',
    urgent: false,
    prefer: ['shelter'],
    hint: 'Prioritises animal shelters listed in OpenStreetMap.',
  },
  {
    id: 'other',
    label: 'Other animal welfare concern',
    urgent: false,
    prefer: ['veterinary', 'shelter'],
    hint: 'Shows nearby veterinary and shelter listings.',
  },
];

export const ANIMAL_TYPES = [
  { id: 'dog', label: 'Dog' },
  { id: 'cat', label: 'Cat' },
  { id: 'other', label: 'Other' },
];

export function getProblem(id) {
  return PROBLEMS.find((problem) => problem.id === id) || PROBLEMS[PROBLEMS.length - 1];
}

export function facilityCategory(tags = {}) {
  const amenity = tags.amenity || '';
  const social = tags.social_facility || '';
  const healthcare = tags.healthcare || '';
  if (amenity === 'veterinary' || healthcare === 'veterinarian') return 'veterinary';
  if (amenity === 'animal_shelter' || amenity === 'animal_boarding' || social === 'animal_shelter') return 'shelter';
  return 'other';
}

export function facilityTypeLabel(category) {
  if (category === 'veterinary') return 'Veterinary';
  if (category === 'shelter') return 'Shelter / rescue';
  return 'Animal service';
}

export function rankFacilities(facilities, origin, problemId) {
  const problem = getProblem(problemId);
  return [...facilities]
    .map((facility) => {
      const km = origin ? haversineKm(origin, facility) : null;
      const preferIndex = problem.prefer.indexOf(facility.category);
      const suitability = preferIndex === -1 ? 2 : preferIndex;
      return { ...facility, distanceKm: km, suitability };
    })
    .sort((a, b) => {
      if (a.suitability !== b.suitability) return a.suitability - b.suitability;
      if (a.distanceKm == null) return 1;
      if (b.distanceKm == null) return -1;
      return a.distanceKm - b.distanceKm;
    });
}
