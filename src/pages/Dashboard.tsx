import { useState, useEffect } from 'react';
import { Users, Calendar, Clock, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Employee, AttendanceRecord, WorkLog } from '@/types/employee';

const Dashboard = () => {
  const { user } = useAuth();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [workLogs, setWorkLogs] = useState<WorkLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      Promise.all([
        fetchEmployees(),
        fetchTodayAttendance(),
        fetchRecentWorkLogs()
      ]).finally(() => setLoading(false));
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
    }
  };

  const fetchTodayAttendance = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const { data, error } = await supabase
        .from('attendance_records')
        .select('*')
        .eq('user_id', user?.id)
        .eq('date', today);

      if (error) {
        console.error('Error fetching attendance:', error);
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
      console.error('Error fetching attendance:', error);
    }
  };

  const fetchRecentWorkLogs = async () => {
    try {
      const { data, error } = await supabase
        .from('work_logs')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) {
        console.error('Error fetching work logs:', error);
        return;
      }

      const formattedWorkLogs: WorkLog[] = data.map(log => ({
        id: log.id,
        employeeId: log.employee_id,
        task: log.task,
        description: log.description || '',
        hoursSpent: parseFloat(log.hours_spent.toString()),
        priority: log.priority as 'low' | 'medium' | 'high',
        status: log.status as 'in-progress' | 'completed' | 'on-hold',
        date: log.date
      }));

      setWorkLogs(formattedWorkLogs);
    } catch (error) {
      console.error('Error fetching work logs:', error);
    }
  };

  const totalEmployees = employees.length;
  const presentToday = attendance.filter(a => a.status === 'present' || a.status === 'late').length;
  const totalHoursToday = workLogs
    .filter(log => log.date === new Date().toISOString().split('T')[0])
    .reduce((sum, log) => sum + log.hoursSpent, 0);
  const activeTasks = workLogs.filter(log => log.status === 'in-progress').length;

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Welcome to your HR management system</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalEmployees}</div>
            <p className="text-xs text-muted-foreground">Active workforce</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Present Today</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{presentToday}</div>
            <p className="text-xs text-muted-foreground">
              {((presentToday / totalEmployees) * 100).toFixed(0)}% attendance rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hours Logged</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalHoursToday}</div>
            <p className="text-xs text-muted-foreground">Today's total</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Tasks</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeTasks}</div>
            <p className="text-xs text-muted-foreground">In progress</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Today's Attendance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {attendance.length === 0 ? (
                <p className="text-sm text-muted-foreground">No attendance records for today</p>
              ) : (
                attendance.map((record) => {
                  const employee = employees.find(e => e.id === record.employeeId);
                  return (
                    <div key={record.id} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{employee?.firstName} {employee?.lastName}</p>
                        <p className="text-sm text-muted-foreground">
                          {record.checkIn || 'Not checked in'} - {record.checkOut || 'Not checked out'}
                        </p>
                      </div>
                      <Badge 
                        variant={record.status === 'present' ? 'default' : 
                                 record.status === 'late' ? 'secondary' : 'destructive'}
                      >
                        {record.status}
                      </Badge>
                    </div>
                  );
                })
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Work Logs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {workLogs.length === 0 ? (
                <p className="text-sm text-muted-foreground">No recent work logs</p>
              ) : (
                workLogs.map((log) => {
                  const employee = employees.find(e => e.id === log.employeeId);
                  return (
                    <div key={log.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="font-medium">{log.task}</p>
                        <Badge 
                          variant={log.priority === 'high' ? 'destructive' : 
                                  log.priority === 'medium' ? 'secondary' : 'outline'}
                        >
                          {log.priority}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {employee?.firstName} {employee?.lastName} • {log.hoursSpent}h
                      </p>
                      <p className="text-sm">{log.description}</p>
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

export default Dashboard;