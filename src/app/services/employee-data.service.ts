import { Injectable } from '@angular/core';
import { signal } from '@angular/core';
import { Employee } from '../models/employee.model';

@Injectable({
  providedIn: 'root'
})
export class EmployeeDataService {

  // Defined employee array using signals
  employeeListing = signal<Employee[]>(this.loadEmployeesFromLocalStorage());

  constructor() { }

  // For adding a new employee
  addEmployee(employee: Employee) {
    employee.id = this.generateId();
    this.employeeListing.update((oldEmps) => {
      const updatedList = [...oldEmps, employee];
      this.saveEmployeesToLocalStorage(updatedList);
      return updatedList;
    });
  }

  // For updating an existing employee's detials
  updateEmployee(employee: Employee, editingEmployeeId: string) {
    const employees = this.employeeListing();
    const index = employees.findIndex(emp => emp.id === editingEmployeeId);
    if (index !== -1) {
      employees[index] = { ...employees[index], ...employee };
      this.employeeListing.update(() => {
        this.saveEmployeesToLocalStorage(employees);
        return [...employees];
      });
    }
  }

  // For deleting an employee's details
  deleteEmployee(employeeId: string) {
    this.employeeListing.update((employees) => {
      const updatedList = employees.filter(emp => emp.id !== employeeId);
      this.saveEmployeesToLocalStorage(updatedList);
      return updatedList;
    });
  }

  // Method for generating newly added employee's id
  generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  // For loading employee details
  private loadEmployeesFromLocalStorage(): Employee[] {
    const savedEmployees = localStorage.getItem('employees');
    return savedEmployees ? JSON.parse(savedEmployees) : [];
  }

  // For saving employee details
  private saveEmployeesToLocalStorage(employees: Employee[]): void {
    localStorage.setItem('employees', JSON.stringify(employees));
  }
}
