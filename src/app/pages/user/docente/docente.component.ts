import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
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
  selector: 'app-docente',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule], // Añade los módulos necesarios aquí
  templateUrl: './docente.component.html',
  styleUrl: './docente.component.css',
})
export class DocenteComponent {
  private apiUrl = 'https://si2parcial.onrender.com/api'; //URL de API
  private tokenKey = 'authToken';
  users: any[] = [];
  formRegister: FormGroup;

  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    this.formRegister = this.fb.group({
      name: ['', Validators.required],
      email: ['', Validators.required],
      age: ['', Validators.required],
      phone: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  ngOnInit() {
    // Asegúrate de implementar OnInit y que esté bien escrito
    this.getUsers().subscribe(
      (data) => {
        this.users = data.filter(
          (userTeacher: any) => userTeacher.role == 'TEACHER'
        );
        console.log('Data:', this.users);
      },
      (error) => {
        console.error('Error:', error);
      }
    );
  }

  getUsers(): Observable<any> {
    console.log('Fetching users...');

    const token = localStorage.getItem(this.tokenKey);
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.get<any>(`${this.apiUrl}/users`, { headers }).pipe(
      tap((response) => {
        console.log('Users fetched successfully:', response);
      }),
      catchError((error) => {
        console.error('Error fetching users:', error);
        return throwError(
          () => new Error('Error fetching users, please try again later.')
        );
      })
    );
  }
  createUser(): void {
    if (this.formRegister.valid) {
      const { name, age, email, password, phone } = this.formRegister.value;
      console.log({ name, age, email, password, phone });

      this.authService
        .registerUser(name, email, age, phone, password, 'TEACHER')
        .subscribe(
          (response) => {
            console.log('User created successfully:', response);

            this.formRegister.reset();
          },
          (error) => {
            console.error('Error creating user:', error);
            alert('Error creating user. Please try again later.');
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
    doc.text("REPORTE DE ADMINISTRADORES", 55, 25);
    const columns = ["ID", "NOMBRE","EDAD","TELEFONO","EMAIL","ROL"];

    const data = this.users.map((user) => [
      user.id,
      user.name,
      user.age,
      user.phoneNumber,
      user.email,
      user.role
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

   
    doc.save("reporteAdministradores.pdf");
  }

  generateExcel = async() => {
   
    const worksheet = XLSX.utils.json_to_sheet(this.users);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');
    XLSX.writeFile(workbook, 'reporteAdministradores' + '.xlsx');
  };
  test(name:string):void { 
    alert('hi' + name);
  }
}
