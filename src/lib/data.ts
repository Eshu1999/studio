import type { Doctor, Appointment, Patient } from './types';

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
    patientId: 'p1',
    patientName: 'John Doe',
    date: '2024-07-29',
    time: '10:00',
    status: 'Upcoming',
  },
  {
    id: 'apt2',
    doctorId: '3',
    patientId: 'p2',
    patientName: 'Jane Smith (Child: Leo)',
    date: '2024-07-30',
    time: '09:30',
    status: 'Upcoming',
  },
  {
    id: 'apt3',
    doctorId: '2',
    patientId: 'p3',
    patientName: 'Peter Jones',
    date: '2024-07-25',
    time: '14:00',
    status: 'Completed',
  },
    {
    id: 'apt4',
    doctorId: '4',
    patientId: 'p4',
    patientName: 'Mary Johnson',
    date: '2024-07-28',
    time: '11:00',
    status: 'Upcoming',
  },
   {
    id: 'apt5',
    doctorId: '1',
    patientId: 'p1',
    patientName: 'John Doe',
    date: '2024-06-15',
    time: '11:00',
    status: 'Completed',
  },
];


export const patients: Patient[] = [
    { id: 'p1', name: 'John Doe', email: 'john.doe@example.com', avatar: 'https://i.pravatar.cc/150?u=p1', lastAppointment: '2024-07-29', totalAppointments: 2 },
    { id: 'p2', name: 'Jane Smith', email: 'jane.smith@example.com', avatar: 'https://i.pravatar.cc/150?u=p2', lastAppointment: '2024-07-30', totalAppointments: 1 },
    { id: 'p3', name: 'Peter Jones', email: 'peter.jones@example.com', avatar: 'https://i.pravatar.cc/150?u=p3', lastAppointment: '2024-07-25', totalAppointments: 1 },
    { id: 'p4', name: 'Mary Johnson', email: 'mary.johnson@example.com', avatar: 'https://i.pravatar.cc/150?u=p4', lastAppointment: '2024-07-28', totalAppointments: 1 },
];
