import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  private router = inject(Router);
  private authService = inject(AuthService);

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
