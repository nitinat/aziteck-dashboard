import { useState } from 'react';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Employee } from '@/types/employee';

interface EmployeeFormProps {
  employee: Employee | null;
  onClose: () => void;
  onSave: (employeeData: Partial<Employee>) => void;
}

export const EmployeeForm = ({ employee, onClose, onSave }: EmployeeFormProps) => {
  const [formData, setFormData] = useState({
    firstName: employee?.firstName || '',
    lastName: employee?.lastName || '',
    email: employee?.email || '',
    phone: employee?.phone || '',
    position: employee?.position || '',
    department: employee?.department || '',
    address: employee?.address || '',
    educationDegree: employee?.educationDegree || '',
    branch: employee?.branch || '',
    skills: employee?.skills || '',
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
              <SelectItem value="Software Development">Software Development</SelectItem>
              <SelectItem value="AI & Data Science">AI & Data Science</SelectItem>
              <SelectItem value="Quality Analysis">Quality Analysis</SelectItem>
              <SelectItem value="Automation">Automation</SelectItem>
              <SelectItem value="Product Development">Product Development</SelectItem>
              <SelectItem value="Design (UX/UI)">Design (UX/UI)</SelectItem>
              <SelectItem value="Product Management">Product Management</SelectItem>
              <SelectItem value="Content Engineering">Content Engineering</SelectItem>
              <SelectItem value="Sales & Marketing">Sales & Marketing</SelectItem>
              <SelectItem value="Customer Success & Support">Customer Success & Support</SelectItem>
              <SelectItem value="People & Operations">People & Operations</SelectItem>
              <SelectItem value="Strategy & Innovation Office">Strategy & Innovation Office</SelectItem>
              <SelectItem value="Innovation Labs">Innovation Labs</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div>
        <Label htmlFor="address">Address</Label>
        <Input 
          id="address" 
          value={formData.address}
          onChange={(e) => handleInputChange('address', e.target.value)}
          placeholder="123 Main Street, City, State, Country"
          required
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="educationDegree">Education Degree</Label>
          <Select 
            value={formData.educationDegree} 
            onValueChange={(value) => handleInputChange('educationDegree', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select degree" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="High School">High School</SelectItem>
              <SelectItem value="Associate Degree">Associate Degree</SelectItem>
              <SelectItem value="Bachelor's Degree">Bachelor's Degree</SelectItem>
              <SelectItem value="Master's Degree">Master's Degree</SelectItem>
              <SelectItem value="PhD">PhD</SelectItem>
              <SelectItem value="Professional Certification">Professional Certification</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="branch">Branch/Field</Label>
          <Input 
            id="branch" 
            value={formData.branch}
            onChange={(e) => handleInputChange('branch', e.target.value)}
            placeholder="Computer Science, Engineering, etc."
            required
          />
        </div>
      </div>
      
      <div>
        <Label htmlFor="skills">Skills</Label>
        <Input 
          id="skills" 
          value={formData.skills}
          onChange={(e) => handleInputChange('skills', e.target.value)}
          placeholder="JavaScript, React, Node.js, etc."
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