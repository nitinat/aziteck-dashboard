import { useState } from 'react';
import { Plus, Edit, Trash2, Mail, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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

const EmployeeForm = ({ employee, onClose }: { employee: Employee | null; onClose: () => void }) => {
  return (
    <form className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="firstName">First Name</Label>
          <Input 
            id="firstName" 
            defaultValue={employee?.firstName || ''} 
            placeholder="John"
          />
        </div>
        <div>
          <Label htmlFor="lastName">Last Name</Label>
          <Input 
            id="lastName" 
            defaultValue={employee?.lastName || ''} 
            placeholder="Doe"
          />
        </div>
      </div>
      
      <div>
        <Label htmlFor="email">Email</Label>
        <Input 
          id="email" 
          type="email"
          defaultValue={employee?.email || ''} 
          placeholder="john.doe@company.com"
        />
      </div>
      
      <div>
        <Label htmlFor="phone">Phone</Label>
        <Input 
          id="phone" 
          defaultValue={employee?.phone || ''} 
          placeholder="+1-555-0123"
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="position">Position</Label>
          <Input 
            id="position" 
            defaultValue={employee?.position || ''} 
            placeholder="Software Engineer"
          />
        </div>
        <div>
          <Label htmlFor="department">Department</Label>
          <Select defaultValue={employee?.department || ''}>
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
          defaultValue={employee?.salary || ''} 
          placeholder="75000"
        />
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