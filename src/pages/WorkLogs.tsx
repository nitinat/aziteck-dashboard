import { useState, useEffect } from 'react';
import { Plus, Clock, AlertCircle, CheckCircle, Pause } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { WorkLog, Employee } from '@/types/employee';
import { toast } from 'sonner';

const WorkLogs = () => {
  const { user } = useAuth();
  const [workLogs, setWorkLogs] = useState<WorkLog[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchEmployees();
      fetchWorkLogs();
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

  const fetchWorkLogs = async () => {
    try {
      const { data, error } = await supabase
        .from('work_logs')
        .select('*')
        .eq('user_id', user?.id)
        .order('date', { ascending: false });

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

  const filteredLogs = workLogs.filter(log => 
    selectedEmployee === 'all' || log.employeeId === selectedEmployee
  );

  const totalHours = filteredLogs.reduce((sum, log) => sum + log.hoursSpent, 0);
  const completedTasks = filteredLogs.filter(log => log.status === 'completed').length;
  const inProgressTasks = filteredLogs.filter(log => log.status === 'in-progress').length;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-success" />;
      case 'in-progress': return <Clock className="h-4 w-4 text-primary" />;
      case 'on-hold': return <Pause className="h-4 w-4 text-warning" />;
      default: return null;
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return <AlertCircle className="h-4 w-4 text-destructive" />;
      case 'medium': return <AlertCircle className="h-4 w-4 text-warning" />;
      case 'low': return <AlertCircle className="h-4 w-4 text-muted-foreground" />;
      default: return null;
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Work Logs</h1>
          <p className="text-muted-foreground">Loading work logs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Work Logs</h1>
          <p className="text-muted-foreground">Track daily tasks and productivity</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Work Log
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add New Work Log</DialogTitle>
            </DialogHeader>
            <WorkLogForm onClose={() => setIsDialogOpen(false)} employees={employees} onSave={fetchWorkLogs} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Hours</p>
                <p className="text-2xl font-bold">{totalHours}</p>
              </div>
              <Clock className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold">{completedTasks}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">In Progress</p>
                <p className="text-2xl font-bold">{inProgressTasks}</p>
              </div>
              <Clock className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Hours/Task</p>
                <p className="text-2xl font-bold">
                  {filteredLogs.length > 0 ? (totalHours / filteredLogs.length).toFixed(1) : 0}
                </p>
              </div>
              <AlertCircle className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Work Log History</CardTitle>
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
            {filteredLogs.map((log) => {
              const employee = employees.find(e => e.id === log.employeeId);
              return (
                <div key={log.id} className="p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold">{log.task}</h3>
                        <div className="flex items-center gap-1">
                          {getPriorityIcon(log.priority)}
                          <Badge 
                            variant={
                              log.priority === 'high' ? 'destructive' : 
                              log.priority === 'medium' ? 'secondary' : 'outline'
                            }
                          >
                            {log.priority}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-1">
                          {getStatusIcon(log.status)}
                          <Badge 
                            variant={
                              log.status === 'completed' ? 'default' : 
                              log.status === 'in-progress' ? 'secondary' : 'outline'
                            }
                          >
                            {log.status}
                          </Badge>
                        </div>
                      </div>
                      
                      <p className="text-muted-foreground mb-2">{log.description}</p>
                      
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{employee?.firstName} {employee?.lastName}</span>
                        <span>•</span>
                        <span>{new Date(log.date).toLocaleDateString()}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {log.hoursSpent}h
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const WorkLogForm = ({ onClose, employees, onSave }: { onClose: () => void; employees: Employee[]; onSave: () => void }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    employeeId: '',
    task: '',
    description: '',
    hoursSpent: '',
    priority: 'medium',
    status: 'in-progress'
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !formData.employeeId || !formData.task || !formData.hoursSpent) {
      toast.error('Please fill in all required fields');
      return;
    }

    setSaving(true);
    try {
      const { error } = await supabase
        .from('work_logs')
        .insert({
          user_id: user.id,
          employee_id: formData.employeeId,
          task: formData.task,
          description: formData.description,
          hours_spent: parseFloat(formData.hoursSpent),
          priority: formData.priority,
          status: formData.status,
          date: new Date().toISOString().split('T')[0]
        });

      if (error) {
        console.error('Error creating work log:', error);
        toast.error('Failed to create work log');
        return;
      }

      toast.success('Work log created successfully');
      onSave();
      onClose();
    } catch (error) {
      console.error('Error creating work log:', error);
      toast.error('Failed to create work log');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="employee">Employee *</Label>
        <Select value={formData.employeeId} onValueChange={(value) => setFormData({...formData, employeeId: value})}>
          <SelectTrigger>
            <SelectValue placeholder="Select employee" />
          </SelectTrigger>
          <SelectContent>
            {employees.map((employee) => (
              <SelectItem key={employee.id} value={employee.id}>
                {employee.firstName} {employee.lastName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="task">Task Title *</Label>
        <Input 
          id="task" 
          placeholder="API Development" 
          value={formData.task}
          onChange={(e) => setFormData({...formData, task: e.target.value})}
        />
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea 
          id="description" 
          placeholder="Describe the work performed..."
          rows={3}
          value={formData.description}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="hours">Hours Spent *</Label>
          <Input 
            id="hours" 
            type="number" 
            step="0.5" 
            placeholder="8" 
            value={formData.hoursSpent}
            onChange={(e) => setFormData({...formData, hoursSpent: e.target.value})}
          />
        </div>
        <div>
          <Label htmlFor="priority">Priority</Label>
          <Select value={formData.priority} onValueChange={(value) => setFormData({...formData, priority: value})}>
            <SelectTrigger>
              <SelectValue placeholder="Select priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="status">Status</Label>
        <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value})}>
          <SelectTrigger>
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="in-progress">In Progress</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="on-hold">On Hold</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onClose} disabled={saving}>
          Cancel
        </Button>
        <Button type="submit" disabled={saving}>
          {saving ? 'Adding...' : 'Add Work Log'}
        </Button>
      </div>
    </form>
  );
};

export default WorkLogs;