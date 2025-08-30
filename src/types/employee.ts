export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  position: string;
  department: string;
  hireDate: string;
  address: string;
  educationDegree: string;
  branch: string;
  skills: string;
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
  status: 'active' | 'inactive';
}

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  date: string;
  checkIn?: string;
  checkOut?: string;
  status: 'present' | 'absent' | 'late' | 'half-day';
  workLocation?: 'WFO' | 'WFH';
  notes?: string;
}

export interface WorkLog {
  id: string;
  employeeId: string;
  date: string;
  task: string;
  description: string;
  hoursSpent: number;
  priority: 'low' | 'medium' | 'high';
  status: 'in-progress' | 'completed' | 'on-hold';
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  leaveType: 'Earned' | 'Casual' | 'Sick';
  startDate: string;
  endDate: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  approvedBy?: string;
  approvedAt?: string;
  createdAt: string;
}

export interface Holiday {
  id: string;
  title: string;
  date: string;
  description?: string;
  type: 'company' | 'national' | 'religious';
  isRecurring: boolean;
  createdAt: string;
}
