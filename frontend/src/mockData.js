/** Mock data aligned with CareConnect domains — no backend. */

export const caregivers = [
  {
    id: 'cg-1',
    first_name: 'Maya',
    last_name: 'Chen',
    email: 'maya.chen@example.com',
    phone: '(555) 201-8844',
    is_verified: true,
    rating: 4.9,
    certifications: ['CPR', 'HHA'],
  },
  {
    id: 'cg-2',
    first_name: 'Jordan',
    last_name: 'Reyes',
    email: 'j.reyes@example.com',
    phone: '(555) 310-2291',
    is_verified: true,
    rating: 4.7,
    certifications: ['RN', 'BLS'],
  },
  {
    id: 'cg-3',
    first_name: 'Sam',
    last_name: 'Okonkwo',
    email: 'sam.o@example.com',
    phone: '(555) 441-0098',
    is_verified: false,
    rating: 4.2,
    certifications: ['HHA'],
  },
]

export const careReceivers = [
  {
    id: 'cr-1',
    first_name: 'Eleanor',
    last_name: 'Vance',
    birthday: '1948-03-12',
    sex: 'F',
    diagnoses: ['Type 2 diabetes', 'Hypertension'],
    medications: ['Metformin', 'Lisinopril'],
    insurance: 'SilverCare PPO',
  },
  {
    id: 'cr-2',
    first_name: 'Robert',
    last_name: 'Nguyen',
    birthday: '1955-11-02',
    sex: 'M',
    diagnoses: ['Osteoarthritis'],
    medications: ['Acetaminophen PRN'],
    insurance: 'Community Health HMO',
  },
]

export const appointments = [
  {
    id: 'ap-1',
    caregiver: 'Maya Chen',
    receiver: 'Eleanor Vance',
    start: '2026-04-14T09:00:00',
    end: '2026-04-14T11:00:00',
    status: 'confirmed',
    notes: 'Mobility assistance + vitals',
  },
  {
    id: 'ap-2',
    caregiver: 'Jordan Reyes',
    receiver: 'Robert Nguyen',
    start: '2026-04-15T14:00:00',
    end: '2026-04-15T15:30:00',
    status: 'pending',
    notes: 'Post-op check-in',
  },
  {
    id: 'ap-3',
    caregiver: 'Sam Okonkwo',
    receiver: 'Eleanor Vance',
    start: '2026-04-16T10:00:00',
    end: '2026-04-16T12:00:00',
    status: 'completed',
    notes: 'Medication reminder visit',
  },
]

export const certifications = [
  { code: 'CPR', name: 'CPR / AED', issuer: 'AHA', renewal_months: 24 },
  { code: 'HHA', name: 'Home Health Aide', issuer: 'State Board', renewal_months: 24 },
  { code: 'RN', name: 'Registered Nurse', issuer: 'State BON', renewal_months: 0 },
  { code: 'BLS', name: 'Basic Life Support', issuer: 'AHA', renewal_months: 24 },
]

export const messages = [
  {
    id: 'msg-1',
    appointment_id: 'ap-1',
    preview: "I'll arrive 10 min early for parking.",
    sent_at: '2026-04-13T18:22:00',
    role: 'caregiver',
  },
  {
    id: 'msg-2',
    appointment_id: 'ap-1',
    preview: 'Thank you — side door is unlocked.',
    sent_at: '2026-04-13T18:25:00',
    role: 'family',
  },
  {
    id: 'msg-3',
    appointment_id: 'ap-2',
    preview: 'Please bring the discharge paperwork.',
    sent_at: '2026-04-13T09:01:00',
    role: 'caregiver',
  },
]
