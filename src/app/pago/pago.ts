import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth.service';

export interface PagoResponse {
  dblCashAmount: number;
  dblCommissionFee: number;
  error: string | null;
  strAutorizationCode: string;
  strName: string;
  strResponseCode: string;
  strResponseMessage: string;
}

@Component({
  selector: 'app-pago',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './pago.html',
  styleUrl: './pago.css',
})
export class Pago {
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  private auth = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);

  form: FormGroup = this.fb.group({
    strIdentificador01: ['',],
    strIdentificador02: ['',],
    strIdentificador03: ['',],
    strPin: ['', Validators.required],
    dblCashAmount: ['', [Validators.required, Validators.min(0.01)]],
    strCurrency: ['320']
  });

  loading = false;
  resultado: PagoResponse | null = null;
  errorMsg: string | null = null;

  onSubmit() {
    if (this.form.invalid) return;

    this.loading = true;
    this.errorMsg = null;
    this.resultado = null;

    const payload = this.form.value;
    const apiUrl = 'http://localhost:8080/api/payment'; // O el endpoint que corresponda

    const token = this.auth.token;
    const headers = new HttpHeaders({
      'Authorization': `${token}`,
      'Content-Type': 'application/json'
    });

    this.http.post<PagoResponse>(apiUrl, payload, { headers }).subscribe({
      next: (res) => {
        this.resultado = res;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error en el pago', err);
        this.errorMsg = 'Ocurrió un error al procesar el pago. Por favor intente de nuevo.';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }
}
