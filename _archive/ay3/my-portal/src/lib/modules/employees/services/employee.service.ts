import { createCrudService } from '$lib/services/crud';
import type { Employee, EmployeeInsert, EmployeeUpdate } from '../types/employee.types';

export const employeeService = createCrudService<Employee, EmployeeInsert, EmployeeUpdate>('employees');
