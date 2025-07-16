import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { EmployeeCard } from '@/components/EmployeeCard';
import { EmployeeForm } from '@/components/EmployeeForm';
import { Employee } from '@/types/employee';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const Employees = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Fetch employees from database
  const fetchEmployees = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please log in to view employees",
          variant: "destructive"
        });
        return;
      }

      const { data, error } = await supabase
        .from('employees')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

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
          relationship: emp.emergency_contact_relationship
        },
        status: emp.status as 'active' | 'inactive'
      }));

      setEmployees(formattedEmployees);
    } catch (error) {
      console.error('Error fetching employees:', error);
      toast({
        title: "Error",
        description: "Failed to fetch employees",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleAddEmployee = () => {
    setSelectedEmployee(null);
    setIsDialogOpen(true);
  };

  const handleEditEmployee = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsDialogOpen(true);
  };

  const handleSaveEmployee = async (employeeData: Partial<Employee>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please log in to save employees",
          variant: "destructive"
        });
        return;
      }

      if (selectedEmployee) {
        // Update existing employee
        const { error } = await supabase
          .from('employees')
          .update({
            first_name: employeeData.firstName,
            last_name: employeeData.lastName,
            email: employeeData.email,
            phone: employeeData.phone,
            position: employeeData.position,
            department: employeeData.department,
            hire_date: employeeData.hireDate,
            salary: 0, // Default value since it's still required in the database
            address: employeeData.address || '',
            education_degree: employeeData.educationDegree || '',
            branch: employeeData.branch || '',
            skills: employeeData.skills || '',
            emergency_contact_name: employeeData.emergencyContact?.name || '',
            emergency_contact_phone: employeeData.emergencyContact?.phone || '',
            emergency_contact_relationship: employeeData.emergencyContact?.relationship || '',
            status: employeeData.status || 'active'
          })
          .eq('id', selectedEmployee.id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Employee updated successfully"
        });
      } else {
        // Add new employee
        const { error } = await supabase
          .from('employees')
          .insert({
            user_id: user.id,
            first_name: employeeData.firstName || '',
            last_name: employeeData.lastName || '',
            email: employeeData.email || '',
            phone: employeeData.phone || '',
            position: employeeData.position || '',
            department: employeeData.department || '',
            hire_date: employeeData.hireDate || new Date().toISOString().split('T')[0],
            salary: 0, // Default value since it's still required in the database
            address: employeeData.address || '',
            education_degree: employeeData.educationDegree || '',
            branch: employeeData.branch || '',
            skills: employeeData.skills || '',
            emergency_contact_name: employeeData.emergencyContact?.name || '',
            emergency_contact_phone: employeeData.emergencyContact?.phone || '',
            emergency_contact_relationship: employeeData.emergencyContact?.relationship || '',
            status: 'active'
          });

        if (error) throw error;

        toast({
          title: "Success",
          description: "Employee added successfully"
        });
      }

      setIsDialogOpen(false);
      fetchEmployees(); // Refresh the list
    } catch (error) {
      console.error('Error saving employee:', error);
      toast({
        title: "Error",
        description: "Failed to save employee",
        variant: "destructive"
      });
    }
  };

  const handleDeleteEmployee = async (employeeId: string) => {
    try {
      const { error } = await supabase
        .from('employees')
        .delete()
        .eq('id', employeeId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Employee deleted successfully"
      });

      fetchEmployees(); // Refresh the list
    } catch (error) {
      console.error('Error deleting employee:', error);
      toast({
        title: "Error",
        description: "Failed to delete employee",
        variant: "destructive"
      });
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

      {loading ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">Loading employees...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {employees.length === 0 ? (
            <div className="col-span-full text-center py-8">
              <p className="text-muted-foreground">No employees found. Add your first employee!</p>
            </div>
          ) : (
            employees.map((employee) => (
              <EmployeeCard
                key={employee.id}
                employee={employee}
                onEdit={handleEditEmployee}
                onDelete={handleDeleteEmployee}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
};


export default Employees;