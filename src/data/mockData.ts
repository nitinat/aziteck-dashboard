import { Employee, AttendanceRecord, WorkLog } from '@/types/employee';

export const mockEmployees: Employee[] = [
  {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@company.com',
    phone: '+1-555-0123',
    position: 'Software Engineer',
    department: 'Software Development',
    hireDate: '2023-01-15',
    address: '123 Main St, City, State 12345',
    educationDegree: 'Bachelor\'s Degree',
    branch: 'Computer Science',
    skills: 'JavaScript, React, Node.js, Python',
    emergencyContact: {
      name: 'Jane Doe',
      phone: '+1-555-0124',
      relationship: 'Spouse'
    },
    status: 'active'
  },
  {
    id: '2',
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah.johnson@company.com',
    phone: '+1-555-0125',
    position: 'Product Manager',
    department: 'Product Management',
    hireDate: '2022-08-20',
    address: '456 Oak Ave, City, State 12345',
    educationDegree: 'Master\'s Degree',
    branch: 'Business Administration',
    skills: 'Product Strategy, Agile, Analytics, Roadmap Planning',
    emergencyContact: {
      name: 'Mike Johnson',
      phone: '+1-555-0126',
      relationship: 'Brother'
    },
    status: 'active'
  },
  {
    id: '3',
    firstName: 'Michael',
    lastName: 'Chen',
    email: 'michael.chen@company.com',
    phone: '+1-555-0127',
    position: 'UX Designer',
    department: 'Design (UX/UI)',
    hireDate: '2023-03-10',
    address: '789 Pine Rd, City, State 12345',
    educationDegree: 'Bachelor\'s Degree',
    branch: 'Graphic Design',
    skills: 'Figma, Adobe Creative Suite, User Research, Prototyping',
    emergencyContact: {
      name: 'Lisa Chen',
      phone: '+1-555-0128',
      relationship: 'Wife'
    },
    status: 'active'
  }
];

export const mockAttendance: AttendanceRecord[] = [
  {
    id: '1',
    employeeId: '1',
    date: '2024-01-09',
    checkIn: '09:00',
    checkOut: '17:30',
    status: 'present'
  },
  {
    id: '2',
    employeeId: '2',
    date: '2024-01-09',
    checkIn: '09:15',
    checkOut: '17:45',
    status: 'late'
  },
  {
    id: '3',
    employeeId: '3',
    date: '2024-01-09',
    checkIn: '08:45',
    checkOut: '17:15',
    status: 'present'
  }
];

export const mockWorkLogs: WorkLog[] = [
  {
    id: '1',
    employeeId: '1',
    date: '2024-01-09',
    task: 'API Development',
    description: 'Implementing user authentication endpoints',
    hoursSpent: 6,
    priority: 'high',
    status: 'in-progress'
  },
  {
    id: '2',
    employeeId: '2',
    date: '2024-01-09',
    task: 'Product Planning',
    description: 'Q1 roadmap planning and stakeholder meetings',
    hoursSpent: 4,
    priority: 'medium',
    status: 'completed'
  },
  {
    id: '3',
    employeeId: '3',
    date: '2024-01-09',
    task: 'UI Design',
    description: 'Creating wireframes for new dashboard layout',
    hoursSpent: 5,
    priority: 'medium',
    status: 'in-progress'
  }
];