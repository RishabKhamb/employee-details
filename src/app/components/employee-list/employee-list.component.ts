import { TitleCasePipe } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Employee } from 'src/app/models/employee.model';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.scss']
})
export class EmployeeListComponent {
  imgPath: string = "assets/no-emp-image.png";
  @Input() employeeData: Employee[] = [];
  @Output() editEmployee: EventEmitter<Employee> = new EventEmitter<Employee>();
  @Output() deleteEmployee: EventEmitter<any> = new EventEmitter<any>();

  onEdit(employee: Employee) {
    this.editEmployee.emit(employee);
  }

  onDelete(id: any) {
    this.deleteEmployee.emit(id);
  }
}
