import { useState, useEffect } from 'react';
import { Clock, Calendar, CheckCircle, XCircle, Building, Home, Plus, CalendarDays, FileText, Star, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { AttendanceRecord, Employee, LeaveRequest, Holiday } from '@/types/employee';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Switch } from '@/components/ui/switch';

// Leave form validation schema
const leaveFormSchema = z.object({
  employeeId: z.string().min(1, "Please select an employee"),
  leaveType: z.enum(['Earned', 'Casual', 'Sick']),
  startDate: z.date(),
  endDate: z.date(),
  reason: z.string().min(1, "Please provide a reason for leave"),
}).refine((data) => data.endDate >= data.startDate, {
  message: "End date must be on or after start date",
  path: ["endDate"],
});

// Holiday form validation schema
const holidayFormSchema = z.object({
  title: z.string().min(1, "Please provide a holiday title"),
  date: z.date(),
  description: z.string().optional(),
  type: z.enum(['company', 'national', 'religious']),
  isRecurring: z.boolean().default(false),
});

const Attendance = () => {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedEmployee, setSelectedEmployee] = useState<string>('all');
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedWorkLocation, setSelectedWorkLocation] = useState<{[key: string]: 'WFO' | 'WFH'}>({});
  const [isLeaveDialogOpen, setIsLeaveDialogOpen] = useState(false);
  const [isHolidayDialogOpen, setIsHolidayDialogOpen] = useState(false);

  // Initialize leave form
  const leaveForm = useForm<z.infer<typeof leaveFormSchema>>({
    resolver: zodResolver(leaveFormSchema),
    defaultValues: {
      employeeId: '',
      leaveType: 'Casual',
      reason: '',
    },
  });

  // Initialize holiday form
  const holidayForm = useForm<z.infer<typeof holidayFormSchema>>({
    resolver: zodResolver(holidayFormSchema),
    defaultValues: {
      title: '',
      description: '',
      type: 'company',
      isRecurring: false,
    },
  });

  useEffect(() => {
    if (user) {
      fetchEmployees();
      fetchAttendanceRecords();
      fetchLeaveRequests();
      fetchHolidays();
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
        address: emp.address,
        educationDegree: emp.education_degree || '',
        branch: emp.branch || '',
        skills: emp.skills || '',
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
        status: record.status as 'present' | 'late' | 'absent',
        workLocation: record.work_location as 'WFO' | 'WFH' || 'WFO'
      }));

      setAttendance(formattedRecords);
    } catch (error) {
      console.error('Error fetching attendance records:', error);
    }
  };

  const fetchLeaveRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('leaves')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching leave requests:', error);
        return;
      }

      const formattedLeaves: LeaveRequest[] = data.map(leave => ({
        id: leave.id,
        employeeId: leave.employee_id,
        leaveType: leave.leave_type as 'Earned' | 'Casual' | 'Sick',
        startDate: leave.start_date,
        endDate: leave.end_date,
        reason: leave.reason,
        status: leave.status as 'pending' | 'approved' | 'rejected',
        approvedBy: leave.approved_by || undefined,
        approvedAt: leave.approved_at || undefined,
        createdAt: leave.created_at,
      }));

      setLeaves(formattedLeaves);
    } catch (error) {
      console.error('Error fetching leave requests:', error);
    }
  };

  const fetchHolidays = async () => {
    try {
      const { data, error } = await supabase
        .from('holidays')
        .select('*')
        .eq('user_id', user?.id)
        .order('date', { ascending: true });

      if (error) {
        console.error('Error fetching holidays:', error);
        return;
      }

      const formattedHolidays: Holiday[] = data.map(holiday => ({
        id: holiday.id,
        title: holiday.title,
        date: holiday.date,
        description: holiday.description || undefined,
        type: holiday.type as 'company' | 'national' | 'religious',
        isRecurring: holiday.is_recurring,
        createdAt: holiday.created_at,
      }));

      setHolidays(formattedHolidays);
    } catch (error) {
      console.error('Error fetching holidays:', error);
    }
  };

  const handleCheckIn = async (employeeId: string, workLocation: 'WFO' | 'WFH' = 'WFO') => {
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
          work_location: workLocation,
          status: 'present'
        });

      if (error) {
        console.error('Error creating attendance record:', error);
        toast.error('Failed to check in');
        return;
      }

      toast.success(`Successfully checked in (${workLocation})`);
      fetchAttendanceRecords();
      // Reset the selected work location for this employee
      setSelectedWorkLocation(prev => ({
        ...prev,
        [employeeId]: 'WFO'
      }));
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

  const handleLeaveSubmit = async (values: z.infer<typeof leaveFormSchema>) => {
    try {
      const { error } = await supabase
        .from('leaves')
        .insert({
          user_id: user?.id,
          employee_id: values.employeeId,
          leave_type: values.leaveType,
          start_date: values.startDate.toISOString().split('T')[0],
          end_date: values.endDate.toISOString().split('T')[0],
          reason: values.reason,
          status: 'pending'
        });

      if (error) {
        console.error('Error creating leave request:', error);
        toast.error('Failed to submit leave request');
        return;
      }

      toast.success('Leave request submitted successfully');
      setIsLeaveDialogOpen(false);
      leaveForm.reset();
      fetchLeaveRequests();
    } catch (error) {
      console.error('Error creating leave request:', error);
      toast.error('Failed to submit leave request');
    }
  };

  const handleHolidaySubmit = async (values: z.infer<typeof holidayFormSchema>) => {
    try {
      const { error } = await supabase
        .from('holidays')
        .insert({
          user_id: user?.id,
          title: values.title,
          date: values.date.toISOString().split('T')[0],
          description: values.description || null,
          type: values.type,
          is_recurring: values.isRecurring
        });

      if (error) {
        console.error('Error creating holiday:', error);
        toast.error('Failed to add holiday');
        return;
      }

      toast.success('Holiday added successfully');
      setIsHolidayDialogOpen(false);
      holidayForm.reset();
      fetchHolidays();
    } catch (error) {
      console.error('Error creating holiday:', error);
      toast.error('Failed to add holiday');
    }
  };

  const handleDeleteHoliday = async (holidayId: string) => {
    try {
      const { error } = await supabase
        .from('holidays')
        .delete()
        .eq('id', holidayId);

      if (error) {
        console.error('Error deleting holiday:', error);
        toast.error('Failed to delete holiday');
        return;
      }

      toast.success('Holiday deleted successfully');
      fetchHolidays();
    } catch (error) {
      console.error('Error deleting holiday:', error);
      toast.error('Failed to delete holiday');
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
        <p className="text-muted-foreground">Track employee attendance, working hours, and manage leave requests</p>
      </div>

      <Tabs defaultValue="attendance" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="attendance" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Attendance
          </TabsTrigger>
          <TabsTrigger value="leave" className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4" />
            Leave Management
          </TabsTrigger>
          <TabsTrigger value="holidays" className="flex items-center gap-2">
            <Star className="h-4 w-4" />
            Holiday Calendar
          </TabsTrigger>
        </TabsList>

        <TabsContent value="attendance" className="space-y-6">
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
                    <div key={employee.id} className="flex flex-col p-4 border rounded-lg space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{employee.firstName} {employee.lastName}</p>
                          <p className="text-sm text-muted-foreground">{employee.position}</p>
                          {todayRecord && (
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <span>In: {todayRecord.checkIn}</span>
                              {todayRecord.checkOut && <span>• Out: {todayRecord.checkOut}</span>}
                              {todayRecord.workLocation && (
                                <Badge variant="outline" className="text-xs">
                                  {todayRecord.workLocation === 'WFO' ? (
                                    <><Building className="h-3 w-3 mr-1" />WFO</>
                                  ) : (
                                    <><Home className="h-3 w-3 mr-1" />WFH</>
                                  )}
                                </Badge>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        {!hasCheckedIn ? (
                          <div className="flex items-center gap-2 flex-wrap">
                            <Select
                              value={selectedWorkLocation[employee.id] || 'WFO'}
                              onValueChange={(value: 'WFO' | 'WFH') =>
                                setSelectedWorkLocation(prev => ({
                                  ...prev,
                                  [employee.id]: value
                                }))
                              }
                            >
                              <SelectTrigger className="w-24 h-8">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="WFO">
                                  <div className="flex items-center gap-1">
                                    <Building className="h-3 w-3" />
                                    WFO
                                  </div>
                                </SelectItem>
                                <SelectItem value="WFH">
                                  <div className="flex items-center gap-1">
                                    <Home className="h-3 w-3" />
                                    WFH
                                  </div>
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            <Button 
                              size="sm" 
                              onClick={() => handleCheckIn(employee.id, selectedWorkLocation[employee.id] || 'WFO')}
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Check In
                            </Button>
                          </div>
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
                                 <div className="flex items-center gap-2">
                                   <p className="text-xs text-muted-foreground">
                                     <Calendar className="h-3 w-3 inline mr-1" />
                                     {new Date(record.date).toLocaleDateString()}
                                   </p>
                                   {record.workLocation && (
                                     <Badge variant="outline" className="text-xs">
                                       {record.workLocation === 'WFO' ? (
                                         <><Building className="h-3 w-3 mr-1" />WFO</>
                                       ) : (
                                         <><Home className="h-3 w-3 mr-1" />WFH</>
                                       )}
                                     </Badge>
                                   )}
                                 </div>
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
        </TabsContent>

        <TabsContent value="leave" className="space-y-6">
          {/* Leave Request Form */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Leave Requests</CardTitle>
                <Dialog open={isLeaveDialogOpen} onOpenChange={setIsLeaveDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Request Leave
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Submit Leave Request</DialogTitle>
                    </DialogHeader>
                    <Form {...leaveForm}>
                      <form onSubmit={leaveForm.handleSubmit(handleLeaveSubmit)} className="space-y-4">
                        <FormField
                          control={leaveForm.control}
                          name="employeeId"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Employee</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select employee" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {employees.map((employee) => (
                                    <SelectItem key={employee.id} value={employee.id}>
                                      {employee.firstName} {employee.lastName} - {employee.position}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={leaveForm.control}
                          name="leaveType"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Leave Type</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select leave type" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="Earned">Earned Leave</SelectItem>
                                  <SelectItem value="Casual">Casual Leave</SelectItem>
                                  <SelectItem value="Sick">Sick Leave</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={leaveForm.control}
                          name="startDate"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Start Date</FormLabel>
                              <FormControl>
                                <Input 
                                  type="date" 
                                  {...field} 
                                  value={field.value ? field.value.toISOString().split('T')[0] : ''}
                                  onChange={(e) => field.onChange(new Date(e.target.value))}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={leaveForm.control}
                          name="endDate"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>End Date</FormLabel>
                              <FormControl>
                                <Input 
                                  type="date" 
                                  {...field} 
                                  value={field.value ? field.value.toISOString().split('T')[0] : ''}
                                  onChange={(e) => field.onChange(new Date(e.target.value))}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={leaveForm.control}
                          name="reason"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Reason</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="Please provide a reason for your leave request..." 
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="flex justify-end gap-2">
                          <Button type="button" variant="outline" onClick={() => setIsLeaveDialogOpen(false)}>
                            Cancel
                          </Button>
                          <Button type="submit">Submit Request</Button>
                        </div>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {leaves.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    No leave requests found. Click "Request Leave" to submit a new request.
                  </p>
                ) : (
                  leaves.map((leave) => {
                    const employee = employees.find(e => e.id === leave.employeeId);
                    const startDate = new Date(leave.startDate);
                    const endDate = new Date(leave.endDate);
                    const daysDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
                    
                    return (
                      <div key={leave.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-4">
                          <div>
                            <p className="font-medium">{employee?.firstName} {employee?.lastName}</p>
                            <p className="text-sm text-muted-foreground">{employee?.position}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline" className="text-xs">
                                <FileText className="h-3 w-3 mr-1" />
                                {leave.leaveType}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                {daysDiff} day{daysDiff > 1 ? 's' : ''}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar className="h-4 w-4" />
                            <span>
                              {startDate.toLocaleDateString()} - {endDate.toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">{leave.reason}</p>
                          <Badge 
                            variant={
                              leave.status === 'approved' ? 'default' : 
                              leave.status === 'rejected' ? 'destructive' : 'secondary'
                            }
                            className="mt-2"
                          >
                            {leave.status.charAt(0).toUpperCase() + leave.status.slice(1)}
                          </Badge>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="holidays" className="space-y-6">
          {/* Holiday Management */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Holiday Calendar</CardTitle>
                <Dialog open={isHolidayDialogOpen} onOpenChange={setIsHolidayDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Holiday
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Add Holiday</DialogTitle>
                    </DialogHeader>
                    <Form {...holidayForm}>
                      <form onSubmit={holidayForm.handleSubmit(handleHolidaySubmit)} className="space-y-4">
                        <FormField
                          control={holidayForm.control}
                          name="title"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Holiday Title</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g., Christmas Day, Independence Day" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={holidayForm.control}
                          name="date"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Date</FormLabel>
                              <FormControl>
                                <Input 
                                  type="date" 
                                  {...field} 
                                  value={field.value ? field.value.toISOString().split('T')[0] : ''}
                                  onChange={(e) => field.onChange(new Date(e.target.value))}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={holidayForm.control}
                          name="type"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Holiday Type</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select holiday type" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="company">Company Holiday</SelectItem>
                                  <SelectItem value="national">National Holiday</SelectItem>
                                  <SelectItem value="religious">Religious Holiday</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={holidayForm.control}
                          name="description"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Description (Optional)</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="Additional details about the holiday..." 
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={holidayForm.control}
                          name="isRecurring"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                              <div className="space-y-0.5">
                                <FormLabel>Recurring Holiday</FormLabel>
                                <div className="text-sm text-muted-foreground">
                                  This holiday repeats every year
                                </div>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />

                        <div className="flex justify-end gap-2">
                          <Button type="button" variant="outline" onClick={() => setIsHolidayDialogOpen(false)}>
                            Cancel
                          </Button>
                          <Button type="submit">Add Holiday</Button>
                        </div>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col xl:flex-row gap-6">
                <Card className="xl:w-80 flex-shrink-0">
                  <CardHeader>
                    <CardTitle>Calendar View</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CalendarComponent
                      mode="single"
                      selected={selectedDate}
                      onSelect={(date) => date && setSelectedDate(date)}
                      className="rounded-md border"
                      modifiers={{
                        holiday: holidays.map(holiday => new Date(holiday.date))
                      }}
                      modifiersStyles={{
                        holiday: { backgroundColor: 'hsl(var(--primary))', color: 'white', fontWeight: 'bold' }
                      }}
                    />
                  </CardContent>
                </Card>

                <Card className="flex-1">
                  <CardHeader>
                    <CardTitle>Holiday List</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {holidays.length === 0 ? (
                        <p className="text-muted-foreground text-center py-8">
                          No holidays configured. Click "Add Holiday" to create company holidays.
                        </p>
                      ) : (
                        holidays.map((holiday) => {
                          const holidayDate = new Date(holiday.date);
                          const today = new Date();
                          const isUpcoming = holidayDate >= today;
                          
                          return (
                            <div key={holiday.id} className="flex items-center justify-between p-4 border rounded-lg">
                              <div className="flex items-center gap-4">
                                <div>
                                  <p className="font-medium">{holiday.title}</p>
                                  <p className="text-sm text-muted-foreground">
                                    {holidayDate.toLocaleDateString('en-US', { 
                                      weekday: 'long', 
                                      year: 'numeric', 
                                      month: 'long', 
                                      day: 'numeric' 
                                    })}
                                  </p>
                                  {holiday.description && (
                                    <p className="text-xs text-muted-foreground mt-1">
                                      {holiday.description}
                                    </p>
                                  )}
                                  <div className="flex items-center gap-2 mt-2">
                                    <Badge 
                                      variant={
                                        holiday.type === 'national' ? 'default' : 
                                        holiday.type === 'religious' ? 'secondary' : 'outline'
                                      }
                                      className="text-xs"
                                    >
                                      {holiday.type.charAt(0).toUpperCase() + holiday.type.slice(1)}
                                    </Badge>
                                    {holiday.isRecurring && (
                                      <Badge variant="outline" className="text-xs">
                                        Recurring
                                      </Badge>
                                    )}
                                    {isUpcoming && (
                                      <Badge variant="destructive" className="text-xs">
                                        Upcoming
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleDeleteHoliday(holiday.id)}
                                className="text-destructive hover:text-destructive"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
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