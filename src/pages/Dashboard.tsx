import { Users, Calendar, Clock, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { mockEmployees, mockAttendance, mockWorkLogs } from '@/data/mockData';

const Dashboard = () => {
  const totalEmployees = mockEmployees.length;
  const presentToday = mockAttendance.filter(a => a.status === 'present' || a.status === 'late').length;
  const totalHoursToday = mockWorkLogs.reduce((sum, log) => sum + log.hoursSpent, 0);
  const activeTasks = mockWorkLogs.filter(log => log.status === 'in-progress').length;

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
              {mockAttendance.map((record) => {
                const employee = mockEmployees.find(e => e.id === record.employeeId);
                return (
                  <div key={record.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{employee?.firstName} {employee?.lastName}</p>
                      <p className="text-sm text-muted-foreground">
                        {record.checkIn} - {record.checkOut || 'Not checked out'}
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
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Work Logs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockWorkLogs.map((log) => {
                const employee = mockEmployees.find(e => e.id === log.employeeId);
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
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;