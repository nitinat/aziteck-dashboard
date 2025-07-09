import { useState } from 'react';
import { Plus, Edit, Trash2, Mail, Phone, CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { mockEmployees } from '@/data/mockData';
import { Employee } from '@/types/employee';

const Employees = () => {
  const [employees, setEmployees] = useState<Employee[]>(mockEmployees);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleAddEmployee = () => {
    setSelectedEmployee(null);
    setIsDialogOpen(true);
  };

  const handleEditEmployee = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsDialogOpen(true);
  };

  const handleSaveEmployee = (employeeData: Partial<Employee>) => {
    if (selectedEmployee) {
      // Update existing employee
      setEmployees(prev => prev.map(emp => 
        emp.id === selectedEmployee.id 
          ? { ...emp, ...employeeData }
          : emp
      ));
    } else {
      // Add new employee
      const newEmployee: Employee = {
        id: (employees.length + 1).toString(),
        firstName: employeeData.firstName || '',
        lastName: employeeData.lastName || '',
        email: employeeData.email || '',
        phone: employeeData.phone || '',
        position: employeeData.position || '',
        department: employeeData.department || '',
        hireDate: new Date().toISOString().split('T')[0],
        salary: employeeData.salary || 0,
        address: '',
        emergencyContact: {
          name: '',
          phone: '',
          relationship: ''
        },
        status: 'active'
      };
      setEmployees(prev => [...prev, newEmployee]);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Employees</h1>
          <p className="text-muted-foreground">Manage your workforce</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAddEmployee}>
              <Plus className="h-4 w-4 mr-2" />
              Add Employee
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>
                {selectedEmployee ? 'Edit Employee' : 'Add New Employee'}
              </DialogTitle>
            </DialogHeader>
            <EmployeeForm 
              employee={selectedEmployee} 
              onClose={() => setIsDialogOpen(false)}
              onSave={handleSaveEmployee}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {employees.map((employee) => (
          <Card key={employee.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">
                  {employee.firstName} {employee.lastName}
                </CardTitle>
                <Badge variant={employee.status === 'active' ? 'default' : 'secondary'}>
                  {employee.status}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">{employee.position}</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{employee.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{employee.phone}</span>
                </div>
                <div className="text-sm">
                  <span className="font-medium">Department:</span> {employee.department}
                </div>
                <div className="text-sm">
                  <span className="font-medium">Hire Date:</span> {new Date(employee.hireDate).toLocaleDateString()}
                </div>
                <div className="flex gap-2 pt-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleEditEmployee(employee)}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button variant="outline" size="sm">
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

const EmployeeForm = ({ 
  employee, 
  onClose, 
  onSave 
}: { 
  employee: Employee | null; 
  onClose: () => void;
  onSave: (employeeData: Partial<Employee>) => void;
}) => {
  const [formData, setFormData] = useState({
    firstName: employee?.firstName || '',
    lastName: employee?.lastName || '',
    email: employee?.email || '',
    phone: employee?.phone || '',
    position: employee?.position || '',
    department: employee?.department || '',
    salary: employee?.salary || 0,
    hireDate: employee?.hireDate || '',
  });
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    employee?.hireDate ? new Date(employee.hireDate) : undefined
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedFormData = {
      ...formData,
      hireDate: selectedDate ? selectedDate.toISOString().split('T')[0] : formData.hireDate
    };
    onSave(updatedFormData);
    onClose();
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="firstName">First Name</Label>
          <Input 
            id="firstName" 
            value={formData.firstName}
            onChange={(e) => handleInputChange('firstName', e.target.value)}
            placeholder="John"
            required
          />
        </div>
        <div>
          <Label htmlFor="lastName">Last Name</Label>
          <Input 
            id="lastName" 
            value={formData.lastName}
            onChange={(e) => handleInputChange('lastName', e.target.value)}
            placeholder="Doe"
            required
          />
        </div>
      </div>
      
      <div>
        <Label htmlFor="email">Email</Label>
        <Input 
          id="email" 
          type="email"
          value={formData.email}
          onChange={(e) => handleInputChange('email', e.target.value)}
          placeholder="john.doe@company.com"
          required
        />
      </div>
      
      <div>
        <Label htmlFor="phone">Phone</Label>
        <Input 
          id="phone" 
          value={formData.phone}
          onChange={(e) => handleInputChange('phone', e.target.value)}
          placeholder="+1-555-0123"
          required
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="position">Position</Label>
          <Input 
            id="position" 
            value={formData.position}
            onChange={(e) => handleInputChange('position', e.target.value)}
            placeholder="Software Engineer"
            required
          />
        </div>
        <div>
          <Label htmlFor="department">Department</Label>
          <Select 
            value={formData.department} 
            onValueChange={(value) => handleInputChange('department', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Engineering">Engineering</SelectItem>
              <SelectItem value="Product">Product</SelectItem>
              <SelectItem value="Design">Design</SelectItem>
              <SelectItem value="Marketing">Marketing</SelectItem>
              <SelectItem value="Sales">Sales</SelectItem>
              <SelectItem value="HR">HR</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div>
        <Label htmlFor="salary">Salary</Label>
        <Input 
          id="salary" 
          type="number"
          value={formData.salary}
          onChange={(e) => handleInputChange('salary', parseInt(e.target.value) || 0)}
          placeholder="75000"
          required
        />
      </div>
      
      <div>
        <Label>Hire Date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !selectedDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              initialFocus
              className="pointer-events-auto"
            />
          </PopoverContent>
        </Popover>
      </div>
      
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit">
          {employee ? 'Update' : 'Add'} Employee
        </Button>
      </div>
    </form>
  );
};

export default Employees;