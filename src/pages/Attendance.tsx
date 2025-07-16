import { useState, useEffect } from 'react';
import { Clock, Calendar, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { AttendanceRecord, Employee } from '@/types/employee';
import { toast } from 'sonner';

const Attendance = () => {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedEmployee, setSelectedEmployee] = useState<string>('all');
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchEmployees();
      fetchAttendanceRecords();
    }
  }, [user]);

  const fetchEmployees = async () => {
    try {
      const { data, error } = await supabase
        .from('employees')
        .select('*')
        .eq('user_id', user?.id);

      if (error) {
        console.error('Error fetching employees:', error);
        return;
      }

      const formattedEmployees: Employee[] = data.map(emp => ({
        id: emp.id,
        firstName: emp.first_name,
        lastName: emp.last_name,
        email: emp.email,
        phone: emp.phone,
        position: emp.position,
        department: emp.department,
        hireDate: emp.hire_date,
        salary: emp.salary,
        address: emp.address,
        emergencyContact: {
          name: emp.emergency_contact_name,
          phone: emp.emergency_contact_phone,
          relationship: emp.emergency_contact_relationship,
        },
        status: emp.status as 'active' | 'inactive'
      }));

      setEmployees(formattedEmployees);
    } catch (error) {
      console.error('Error fetching employees:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAttendanceRecords = async () => {
    try {
      const { data, error } = await supabase
        .from('attendance_records')
        .select('*')
        .eq('user_id', user?.id)
        .order('date', { ascending: false });

      if (error) {
        console.error('Error fetching attendance records:', error);
        return;
      }

      const formattedRecords: AttendanceRecord[] = data.map(record => ({
        id: record.id,
        employeeId: record.employee_id,
        date: record.date,
        checkIn: record.check_in || undefined,
        checkOut: record.check_out || undefined,
        status: record.status as 'present' | 'late' | 'absent'
      }));

      setAttendance(formattedRecords);
    } catch (error) {
      console.error('Error fetching attendance records:', error);
    }
  };

  const handleCheckIn = async (employeeId: string) => {
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit' 
    });
    
    try {
      const { error } = await supabase
        .from('attendance_records')
        .insert({
          user_id: user?.id,
          employee_id: employeeId,
          date: now.toISOString().split('T')[0],
          check_in: timeString,
          status: 'present'
        });

      if (error) {
        console.error('Error creating attendance record:', error);
        toast.error('Failed to check in');
        return;
      }

      toast.success('Successfully checked in');
      fetchAttendanceRecords();
    } catch (error) {
      console.error('Error creating attendance record:', error);
      toast.error('Failed to check in');
    }
  };

  const handleCheckOut = async (recordId: string) => {
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit' 
    });
    
    try {
      const { error } = await supabase
        .from('attendance_records')
        .update({ check_out: timeString })
        .eq('id', recordId);

      if (error) {
        console.error('Error updating attendance record:', error);
        toast.error('Failed to check out');
        return;
      }

      toast.success('Successfully checked out');
      fetchAttendanceRecords();
    } catch (error) {
      console.error('Error updating attendance record:', error);
      toast.error('Failed to check out');
    }
  };

  const filteredAttendance = attendance.filter(record => {
    const matchesEmployee = selectedEmployee === 'all' || record.employeeId === selectedEmployee;
    // Show all historical data - don't filter by date unless specifically needed
    return matchesEmployee;
  });

  const todayAttendance = attendance.filter(record => 
    record.date === new Date().toISOString().split('T')[0]
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Attendance Management</h1>
        <p className="text-muted-foreground">Track employee attendance and working hours</p>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Check-in/out</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-center text-muted-foreground">Loading employees...</p>
          ) : employees.length === 0 ? (
            <p className="text-center text-muted-foreground">No employees found. Add employees first to manage attendance.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {employees.map((employee) => {
              const todayRecord = todayAttendance.find(r => r.employeeId === employee.id);
              const hasCheckedIn = !!todayRecord?.checkIn;
              const hasCheckedOut = !!todayRecord?.checkOut;

              return (
                <div key={employee.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">{employee.firstName} {employee.lastName}</p>
                    <p className="text-sm text-muted-foreground">{employee.position}</p>
                    {todayRecord && (
                      <p className="text-xs text-muted-foreground">
                        In: {todayRecord.checkIn} {todayRecord.checkOut && `• Out: ${todayRecord.checkOut}`}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {!hasCheckedIn ? (
                      <Button 
                        size="sm" 
                        onClick={() => handleCheckIn(employee.id)}
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Check In
                      </Button>
                    ) : !hasCheckedOut ? (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleCheckOut(todayRecord.id)}
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        Check Out
                      </Button>
                    ) : (
                      <Badge>Completed</Badge>
                    )}
                  </div>
                </div>
              );
            })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Attendance History */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Select Date</CardTitle>
          </CardHeader>
          <CardContent>
            <CalendarComponent
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              className="rounded-md border"
            />
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Attendance Records</CardTitle>
              <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by employee" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Employees</SelectItem>
                  {employees.map((employee) => (
                    <SelectItem key={employee.id} value={employee.id}>
                      {employee.firstName} {employee.lastName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredAttendance.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  No attendance records found for the selected date and employee.
                </p>
              ) : (
                  filteredAttendance.map((record) => {
                    const employee = employees.find(e => e.id === record.employeeId);
                    return (
                      <div key={record.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-4">
                          <div>
                            <p className="font-medium">{employee?.firstName} {employee?.lastName}</p>
                            <p className="text-sm text-muted-foreground">{employee?.department}</p>
                            <p className="text-xs text-muted-foreground">
                              <Calendar className="h-3 w-3 inline mr-1" />
                              {new Date(record.date).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="flex items-center gap-2 text-sm">
                            <Clock className="h-4 w-4" />
                            <span>{record.checkIn || 'Not checked in'}</span>
                            {record.checkOut && (
                              <>
                                <span>-</span>
                                <span>{record.checkOut}</span>
                              </>
                            )}
                          </div>
                          {record.checkIn && record.checkOut && (
                            <p className="text-xs text-muted-foreground">
                              Total: {calculateHours(record.checkIn, record.checkOut)}h
                            </p>
                          )}
                        </div>
                        <Badge 
                          variant={
                            record.status === 'present' ? 'default' : 
                            record.status === 'late' ? 'secondary' : 'destructive'
                          }
                        >
                          {record.status}
                        </Badge>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const calculateHours = (checkIn: string, checkOut: string): string => {
  const [inHour, inMin] = checkIn.split(':').map(Number);
  const [outHour, outMin] = checkOut.split(':').map(Number);
  
  const inMinutes = inHour * 60 + inMin;
  const outMinutes = outHour * 60 + outMin;
  
  const diffMinutes = outMinutes - inMinutes;
  const hours = Math.floor(diffMinutes / 60);
  const minutes = diffMinutes % 60;
  
  return minutes > 0 ? `${hours}.${Math.round(minutes/60*10)}` : hours.toString();
};

export default Attendance;