import type { Doctor, Appointment } from './types';

export const doctors: Doctor[] = [
  {
    id: '1',
    name: 'Dr. Emily Carter',
    specialization: 'Cardiologist',
    experience: 12,
    bio: 'Dr. Emily Carter is a board-certified cardiologist with over a decade of experience in treating heart conditions. She is passionate about preventive care and patient education.',
    availability: {
      '2024-07-29': ['09:00', '10:00', '11:00', '14:00'],
      '2024-07-30': ['09:30', '10:30', '14:30', '15:30'],
      '2024-07-31': ['10:00', '11:00', '12:00'],
    },
    imageId: 'doctor-1',
  },
  {
    id: '2',
    name: 'Dr. Ben Adams',
    specialization: 'Dermatologist',
    experience: 8,
    bio: 'Dr. Ben Adams specializes in both medical and cosmetic dermatology. He is known for his compassionate approach and dedication to achieving the best outcomes for his patients.',
    availability: {
      '2024-07-29': ['09:00', '11:00', '15:00'],
      '2024-07-30': ['10:00', '12:00', '14:00', '16:00'],
      '2024-08-01': ['09:00', '10:00'],
    },
    imageId: 'doctor-2',
  },
  {
    id: '3',
    name: 'Dr. Chloe Davis',
    specialization: 'Pediatrician',
    experience: 15,
    bio: 'With 15 years of experience, Dr. Chloe Davis provides comprehensive care for children from infancy through adolescence. She creates a welcoming environment for her young patients.',
    availability: {
      '2024-07-30': ['08:30', '09:30', '10:30'],
      '2024-08-01': ['13:00', '14:00', '15:00'],
      '2024-08-02': ['09:00', '10:00', '11:00'],
    },
    imageId: 'doctor-3',
  },
  {
    id: '4',
    name: 'Dr. Marcus Reed',
    specialization: 'Neurologist',
    experience: 10,
    bio: 'Dr. Marcus Reed is an expert in diagnosing and treating disorders of the nervous system. He is committed to using the latest research and technologies in his practice.',
    availability: {
      '2024-07-29': ['13:00', '14:00', '15:00'],
      '2024-07-31': ['09:00', '10:00'],
      '2024-08-02': ['14:00', '15:00', '16:00'],
    },
    imageId: 'doctor-4',
  },
];

export const appointments: Appointment[] = [
  {
    id: 'apt1',
    doctorId: '1',
    patientName: 'John Doe',
    date: '2024-07-29',
    time: '10:00',
    status: 'Upcoming',
  },
  {
    id: 'apt2',
    doctorId: '3',
    patientName: 'Jane Smith (Child: Leo)',
    date: '2024-07-30',
    time: '09:30',
    status: 'Upcoming',
  },
  {
    id: 'apt3',
    doctorId: '2',
    patientName: 'Peter Jones',
    date: '2024-07-25',
    time: '14:00',
    status: 'Completed',
  },
    {
    id: 'apt4',
    doctorId: '4',
    patientName: 'Mary Johnson',
    date: '2024-07-28',
    time: '11:00',
    status: 'Upcoming',
  },
];
