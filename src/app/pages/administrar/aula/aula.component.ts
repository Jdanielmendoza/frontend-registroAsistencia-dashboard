import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-aula',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './aula.component.html',
  styleUrl: './aula.component.css',
})
export class AulaComponent implements OnInit {
  private apiUrl = 'https://si2parcial.onrender.com/api'; //URL de API
  private tokenKey = 'authToken';
  classrooms: any[] = [];
  modules: any[] = [];
  formRegister: FormGroup;

  constructor(private http: HttpClient, private fb: FormBuilder) {
    this.formRegister = this.fb.group({
      name: ['', Validators.required],
      module: ['', Validators.required],
    });
  }

  ngOnInit() {
    // Asegúrate de implementar OnInit y que esté bien escrito
    this.getClassrooms().subscribe(
      (data) => {
        this.classrooms = data;
        console.log('Data:', this.classrooms);
      },
      (error) => {
        console.error('Error:', error);
      }
    );
    this.getModules().subscribe(
      (data) => {
        this.modules = data;
        console.log('Data-modules:', this.modules);
      },
      (error) => {
        console.error('Error:', error);
      }
    );
  }

  getClassrooms(): Observable<any> {
    console.log('Fetching Classrooms...');

    const token = localStorage.getItem(this.tokenKey);
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.get<any>(`${this.apiUrl}/classrooms`, { headers }).pipe(
      tap((response) => {
        console.log('classrooms fetched successfully:', response);
      }),
      catchError((error) => {
        console.error('Error fetching classrooms:', error);
        return throwError(
          () => new Error('Error fetching classrooms, please try again later.')
        );
      })
    );
  }

  createClassroom(): void {
    if (this.formRegister.valid) {
      const { name, module } = this.formRegister.value;
      console.log({ name, module });
      const token = localStorage.getItem(this.tokenKey);
      const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`,
      });

      this.http
        .post<any>(
          `${this.apiUrl}/classrooms`,
          { classroomNumber: name, moduleId: module },
          { headers }
        )
        .subscribe(
          (response) => {
            console.log('classroom created successfully:', response);

            this.formRegister.reset();
          },
          (error) => {
            console.error('Error creating classroom:', error);
            alert('Error creating classroom. Please try again.');
          }
        );
    } else {
      console.warn('Form is invalid');
      alert('Please fill out the form correctly.');
    }
  }

  generatePdf(): void {
    const doc = new jsPDF();

    doc.setFontSize(10);
    doc.text('UNIV-SYS', 15, 35);
    doc.text('Santa Cruz - Bolivia', 15, 40);
    doc.text(`fecha : 18/06/2024`, 145, 40);

    doc.setFontSize(20);
    doc.text('REPORTE DE AULA', 55, 25);
    const columns = ['INDICE', 'MODULO', 'NUMERO DE AULA'];

    const data = this.classrooms.map((classroom,index) => [
      index + 1,
      classroom.module.moduleNumber,
      classroom.classroomNumber
    ]);

    autoTable(doc, {
      startY: 43,
      head: [columns],
      body: data,
      headStyles: { fillColor: [28, 172, 93] },
      styles: {
        cellPadding: 3,
        fontSize: 10,
        valign: 'middle',
        halign: 'left',
      },
    });

    doc.save('reporteAula.pdf');
  }

  generateExcel = async () => {
    const worksheet = XLSX.utils.json_to_sheet(this.classrooms);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');
    XLSX.writeFile(workbook, 'reporteAula' + '.xlsx');
  };

  getModules(): Observable<any> {
    console.log('Fetching modules...');

    const token = localStorage.getItem(this.tokenKey);
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.get<any>(`${this.apiUrl}/modules`, { headers }).pipe(
      tap((response) => {
        console.log('Modules fetched successfully:', response);
      }),
      catchError((error) => {
        console.error('Error fetching modules:', error);
        return throwError(
          () => new Error('Error fetching modules, please try again later.')
        );
      })
    );
  }
}
