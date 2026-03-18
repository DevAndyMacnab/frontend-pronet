import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  constructor(private auth: AuthService, private router: Router) {}

  get token() {
    return this.auth.token;
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
