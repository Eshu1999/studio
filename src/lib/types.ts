export type User = {
  id: string;
  role: 'patient' | 'doctor';
  firstName?: string;
  lastName?: string;
  email?: string;
}

export type Doctor = {
  id: string;
  name: string;
  specialization: string;
  experience: number;
  bio: string;
  availability: Record<string, string[]>;
  imageId: string;
};

export type Appointment = {
  id: string;
  doctorId: string;
  patientId: string;
  patientName: string;
  date: string;
  time: string;
  status: 'Upcoming' | 'Completed' | 'Cancelled';
};

export type Patient = {
    id: string;
    name: string;
    email: string;
    avatar: string;
    lastAppointment: string;
    totalAppointments: number;
}
