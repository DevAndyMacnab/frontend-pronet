import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth.service';

export interface ConsultaResponse {
  dblCashAmount: number;
  dblCommissionFee: number;
  error: string | null;
  strAutorizationCode: string;
  strName: string;
  strResponseCode: string;
  strResponseMessage: string;
}

@Component({
  selector: 'app-consulta',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './consulta.html',
  styleUrl: './consulta.css',
})
export class Consulta {
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  private auth = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);

  form: FormGroup = this.fb.group({
    strIdentificador01: ['',],
    strIdentificador02: ['',],
    strIdentificador03: ['',],
    dblCashAmount: ['', [Validators.required]],
    strCurrency: ['320'],

  });

  loading = false;
  resultado: ConsultaResponse | null = null;
  errorMsg: string | null = null;

  onSubmit() {
    if (this.form.invalid) return;

    this.loading = true;
    this.errorMsg = null;
    this.resultado = null;

    const payload = this.form.value;

    // Puedes cambiar esta URL por el endpoint real configurado en el proxy
    const apiUrl = 'http://localhost:8080/api/consult';

    // Obtener token e incluirlo en los headers
    const token = this.auth.token;
    const headers = new HttpHeaders({
      'Authorization': `${token}`,
      'Content-Type': 'application/json'
    });

    this.http.post<ConsultaResponse>(apiUrl, payload, { headers }).subscribe({
      next: (res) => {
        this.resultado = res;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error en la consulta', err);
        this.errorMsg = 'Ocurrió un error al realizar la consulta. Por favor intente de nuevo.';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }
}
