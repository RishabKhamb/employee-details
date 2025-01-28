import { Component, OnInit, signal, computed, ViewChild, ElementRef } from '@angular/core';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { Employee } from './models/employee.model';
import { EmployeeListComponent } from './components/employee-list/employee-list.component';
import { getCurrentDate, getNextDayByWeekday, addDays, formatDate } from 'src/helper/date-utils';
import { EmployeeDataService } from './services/employee-data.service';
import { closeModal } from 'src/helper/modal-utils';

declare var bootstrap: any;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  formErrors: { [key: string]: string } = {};

  selectedFromDate: string | null = null;
  selectedToDate: string | null = null;

  empForm = signal<Employee>(new Employee());

  fromDateModel: NgbDateStruct | null = null;
  isFromDateCalendarVisible = false;

  toDateModel: NgbDateStruct | null = null;
  isToDateCalendarVisible = false;

  isEditing: boolean = false;
  editingEmployeeId: string | null = null;

  @ViewChild('exampleModal') exampleModal!: ElementRef;
  @ViewChild(EmployeeListComponent) childComponent!: EmployeeListComponent;

  constructor(private employeeDataService: EmployeeDataService) {
  }

  ngOnInit() {
  }

  today = new Date();

  // Dynamically fetch current employee listing
  currentEmployees = computed(() =>
    this.employeeDataService.employeeListing().filter((employee) => {
      const fromDate = employee.fromDate ? new Date(employee.fromDate) : null;
      return fromDate && fromDate >= this.today;
    })
  );

  // Dynamically fetch previous employee listing
  previousEmployees = computed(() =>
    this.employeeDataService.employeeListing().filter((employee) => {
      const fromDate = employee.fromDate ? new Date(employee.fromDate) : null;
      return fromDate && fromDate < this.today;
    })
  );

  // For updating input fields
  empUpdate(fieldName: string, event: any) {
    this.empForm.update(oldEmp => ({ ...oldEmp, [fieldName]: event.target.value }));
  }

  // For updating dates in compatible structure 
  updateDate(selectedDate: NgbDateStruct | null, fieldName: 'fromDate' | 'toDate') {
    if (selectedDate) {
      const formattedDate = `${selectedDate.year}-${selectedDate.month < 10 ? '0' + selectedDate.month : selectedDate.month}-${selectedDate.day < 10 ? '0' + selectedDate.day : selectedDate.day}`;

      this.empForm.update(oldEmp => ({
        ...oldEmp,
        [fieldName]: formattedDate,
      }));

      if (fieldName === 'fromDate') {
        this.selectedToDate = null;
        this.toDateModel = null;

        this.empForm.update(oldEmp => ({
          ...oldEmp,
          toDate: null,
        }));
      }
    } else {
      this.empForm.update(oldEmp => ({
        ...oldEmp,
        [fieldName]: null,
      }));
    }
  }

  // Method for submitting the form
  submitEmployees() {
    if (!this.validateForm()) {
      return;
    }

    const formValue = this.empForm();

    if (this.selectedFromDate && this.selectedToDate) {
      const fromDate = new Date(this.selectedFromDate);
      const toDate = new Date(this.selectedToDate);
      if (toDate < fromDate) {
        this.formErrors['toDate'] = "To date cannot be before From date.";
        return;
      }
    }

    if (this.isEditing && this.editingEmployeeId) {
      this.employeeDataService.updateEmployee(formValue, this.editingEmployeeId);
      this.isEditing = false;
    } else {
      this.employeeDataService.addEmployee(formValue);
    }

    this.clearForm();
    closeModal(this.exampleModal.nativeElement);
  }

  // For closing the form programatically
  closeModal() {
    this.formErrors = {};
    this.clearForm();
    closeModal(this.exampleModal.nativeElement);
  }

  // For deleting the employee data
  deleteEmployee(employeeId: string) {
    this.employeeDataService.deleteEmployee(employeeId);
  }

  // For editing and patching the form values
  editEmployee(employee: Employee) {
    this.formErrors = {};
    this.isEditing = true;
    this.editingEmployeeId = employee.id;
    this.empForm.update(() => ({ ...employee }));

    this.selectedFromDate = employee.fromDate ? formatDate(employee.fromDate) : null;
    this.selectedToDate = employee.toDate ? formatDate(employee.toDate) : null;

    const modal = document.getElementById('exampleModal') as HTMLElement;
    const modalInstance = new bootstrap.Modal(modal);
    modalInstance.show();
  }

  // For opening a fresh form
  openEmployeeForm() {
    this.formErrors = {};
    this.clearForm();
    this.selectedFromDate = null;
    this.selectedToDate = null;

    const modalElement = document.getElementById('exampleModal') as HTMLElement;
    const modalInstance = bootstrap.Modal.getInstance(modalElement);

    if (modalInstance) {
      modalInstance.hide();
    }

    const newModalInstance = new bootstrap.Modal(modalElement);
    newModalInstance.show();
  }

  // For clearing old form details
  clearForm() {
    this.empForm.update(() => new Employee());
    this.isEditing = false;
    this.editingEmployeeId = null;
  }

  // For toggling the calendar modal
  toggleCalendar(calendarType: string) {
    if (calendarType === 'from') {
      this.isFromDateCalendarVisible = !this.isFromDateCalendarVisible;
    } else if (calendarType === 'to') {
      this.isToDateCalendarVisible = !this.isToDateCalendarVisible;
    }
  }

  // For selecting today's date in from date calendar
  setToday() {
    this.fromDateModel = getCurrentDate();
    this.updateDate(this.fromDateModel, 'fromDate');
  }

  // For selecting coming monday's date in from date calendar
  nextMonday() {
    this.fromDateModel = getNextDayByWeekday(1);
    this.updateDate(this.fromDateModel, 'fromDate');
  }

  // For selecting coming tuesday's date in from date calendar  
  nextTuesday() {
    this.fromDateModel = getNextDayByWeekday(2);
    this.updateDate(this.fromDateModel, 'fromDate');
  }

  // For selecting date after 1 week in from date calendar  
  afterOneWeek() {
    this.fromDateModel = addDays(7);
    this.updateDate(this.fromDateModel, 'fromDate');
  }

  // For selecting today's date in to date calendar
  setToToday() {
    this.toDateModel = getCurrentDate();
    this.updateDate(this.toDateModel, 'toDate');
  }

  // Method for basic form validation
  validateForm(): boolean {
    this.formErrors = {};
    let isValid = true;

    if (!this.empForm().name) {
      this.formErrors['name'] = "Name is required.";
      isValid = false;
    }

    if (!this.empForm().role) {
      this.formErrors['role'] = "Role is required.";
      isValid = false;
    }

    if (!this.empForm().fromDate && !this.selectedFromDate) {
      this.formErrors['fromDate'] = "From date is required.";
      isValid = false;
    }

    if (!this.empForm().toDate && !this.selectedToDate) {
      this.formErrors['toDate'] = "To date is required.";
      isValid = false;
    }

    return isValid;
  }

  // For saving the selected date in from and to date calendar
  saveDate(field: 'fromDate' | 'toDate') {
    const dateModel = field === 'fromDate' ? this.fromDateModel : this.toDateModel;

    if (dateModel?.year && dateModel?.month && dateModel?.day) {
      const selectedDate = new Date(dateModel.year, dateModel.month - 1, dateModel.day);

      if (field === 'toDate' && this.selectedFromDate) {
        const fromDate = new Date(this.selectedFromDate);
        if (selectedDate < fromDate) {
          this.formErrors['toDate'] = "To date cannot be before From date.";
          return;
        }
      }

      const day = selectedDate.getDate();
      const month = selectedDate.toLocaleString('default', { month: 'short' });
      const year = selectedDate.getFullYear();

      if (field === 'fromDate') {
        this.selectedFromDate = `${day} ${month} ${year}`;
        this.isFromDateCalendarVisible = false;

        this.selectedToDate = null;
        this.toDateModel = null;

        this.empForm.update(oldEmp => ({
          ...oldEmp,
          toDate: null,
        }));
      } else {
        this.selectedToDate = `${day} ${month} ${year}`;
        this.isToDateCalendarVisible = false;
      }
    }
  }

  // For closing the calendar modal
  closeDateCalendar(field: 'fromDate' | 'toDate') {
    if (field === 'fromDate') {
      this.isFromDateCalendarVisible = false;
    } else {
      this.isToDateCalendarVisible = false;
    }
  }

}
