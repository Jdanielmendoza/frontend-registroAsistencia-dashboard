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
  selector: 'app-modulos',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule], // Añade los módulos necesarios aquí
  templateUrl: './modulos.component.html',
  styleUrls: ['./modulos.component.css'],
})
export class ModulosComponent implements OnInit {
  private apiUrl = 'https://si2parcial.onrender.com/api'; //URL de API
  private tokenKey = 'authToken';
  modules: any[] = [];
  faculties: any[] = [];
  formRegister: FormGroup;

  constructor(private http: HttpClient, private fb: FormBuilder) {
    this.formRegister = this.fb.group({
      name: ['', Validators.required],
      facultie: ['', Validators.required],
    });
  }

  ngOnInit() {
    // Asegúrate de implementar OnInit y que esté bien escrito
    this.getModules().subscribe(
      (data) => {
        this.modules = data;
        console.log('Data-modules:', this.modules);
      },
      (error) => {
        console.error('Error:', error);
      }
    );
    this.getFaculties().subscribe(
      (data) => {
        this.faculties = data;
        console.log('Data-faculties:', this.faculties);
      },
      (error) => {
        console.error('Error:', error);
      }
    );
  }

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

  createModule(): void {
    if (this.formRegister.valid) {
      const { name, facultie } = this.formRegister.value;
      console.log({ name, facultie });

      const token = localStorage.getItem(this.tokenKey);
      const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`,
      });

      this.http
        .post<any>(
          `${this.apiUrl}/modules`,
          { moduleNumber: name, facultyId: facultie },
          { headers }
        )
        .subscribe(
          (response) => {
            console.log('module created successfully:', response);

            this.formRegister.reset();
          },
          (error) => {
            console.error('Error creating facultie:', error);
            alert('Error creating facultie. Please try again.');
          }
        );
    } else {
      console.warn('Form is invalid');
      alert('Please fill out the form correctly.');
    }
  }

  getFaculties(): Observable<any> {
    console.log('Fetching Faculties...');

    const token = localStorage.getItem(this.tokenKey);
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.get<any>(`${this.apiUrl}/faculties`, { headers }).pipe(
      tap((response) => {
        console.log('faculties fetched successfully:', response);
      }),
      catchError((error) => {
        console.error('Error fetching Faculties:', error);
        return throwError(
          () => new Error('Error fetching Faculties, please try again later.')
        );
      })
    );
  }

  /*generar reporte en formato pdf */
  generarReporteModulo(): void {
    const doc = new jsPDF();

    doc.setFontSize(10);
    doc.text('UNIV-SYS', 15, 35);
    doc.text('Santa Cruz - Bolivia', 15, 40);
    doc.text(`fecha : 18/06/2024`, 145, 40);

    doc.setFontSize(20);
    doc.text('REPORTE DE MODULOS', 55, 25);
    const columns = ['CODIGO', 'NOMBRE', 'FACULTAD'];

    const data = this.modules.map((modulo) => [
      modulo.id,
      modulo.moduleNumber,
      modulo.faculty_id.name,
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

    doc.save('modulo.pdf');
  }

  generateExcel = async () => {
    const worksheet = XLSX.utils.json_to_sheet(this.modules);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');
    XLSX.writeFile(workbook, 'reporteModulo' + '.xlsx');
  };
}
