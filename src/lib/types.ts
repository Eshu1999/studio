
export type User = {
  id: string;
  role: 'patient' | 'doctor' | 'admin';
  firstName?: string;
  lastName?: string;
  email?: string;
  verificationStatus?: 'pending' | 'verified' | 'rejected';
}

export type Doctor = {
  id: string;
  name: string;
  specialization: string;
  experience: number;
  bio: string;
  availability: Record<string, string[]>;
  imageId: string;
  verificationStatus: 'pending' | 'verified' | 'rejected';
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
