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
import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-grupo',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './grupo.component.html',
  styleUrl: './grupo.component.css'
})
export class GrupoComponent {
  private apiUrl = 'https://si2parcial.onrender.com/api'; //URL de API
  private tokenKey = 'authToken';
  groups: any[] = [];
  formRegister: FormGroup;

  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
  ) {
    this.formRegister = this.fb.group({
      name: ['', Validators.required]
    });
  }

  ngOnInit() {
    // Asegúrate de implementar OnInit y que esté bien escrito
    this.getGroups().subscribe(
      (data) => {
        this.groups = data;
        console.log('Data:', this.groups);
      },
      (error) => {
        console.error('Error:', error);
      }
    );
  }

  getGroups(): Observable<any> {
    console.log('Fetching Groups...');

    const token = localStorage.getItem(this.tokenKey);
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.get<any>(`${this.apiUrl}/groups`, { headers }).pipe(
      tap((response) => {
        console.log('groups fetched successfully:', response);
      }),
      catchError((error) => {
        console.error('Error fetching groups:', error);
        return throwError(
          () => new Error('Error fetching groups, please try again later.')
        );
      })
    );
  }

  createGroup(): void {
    if (this.formRegister.valid) {
      const { name } = this.formRegister.value;
      console.log({ name });
      const token = localStorage.getItem(this.tokenKey);
      const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`,
      });

      this.http.post<any>(`${this.apiUrl}/groups`, { name},{headers}).subscribe(
        (response) => {
          console.log('group created successfully:', response);
         
          this.formRegister.reset();
        },
        (error) => {
          console.error('Error creating group:', error);
          alert('Error creating group. Please try again.');
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
    doc.text("UNIV-SYS", 15, 35);
    doc.text("Santa Cruz - Bolivia", 15, 40);
    doc.text(`fecha : 18/06/2024`, 145, 40);

    doc.setFontSize(20);
    doc.text("REPORTE DE GRUPO", 55, 25);
    const columns = ["CODIGO", "NOMBRE"];

    const data = this.groups.map((facultie) => [
      facultie.id,
      facultie.name,
    ]);

    autoTable(doc, {
      startY: 43,
      head: [columns],
      body: data,
      headStyles: { fillColor: [28, 172, 93] },
      styles: {
        cellPadding: 3,
        fontSize: 10,
        valign: "middle",
        halign: "left",
      }
    });

   
    doc.save("reporteGrupo.pdf");
  }

  generateExcel = async() => {
   
    const worksheet = XLSX.utils.json_to_sheet(this.groups);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');
    XLSX.writeFile(workbook, 'reporteGrupo' + '.xlsx');
  };
}
