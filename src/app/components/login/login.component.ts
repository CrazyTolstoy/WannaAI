// login.component.ts

import { Component, OnInit } from '@angular/core'; // Add OnInit if not already present
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar'; // Import MatSnackBar

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit { // Implement OnInit

  email = '';
  password = '';
  showPassword = false;
  opened = false;

keepOpen() {
  this.opened = true;
}

  constructor(
    private authService: AuthService, 
    private router: Router,
    private snackBar: MatSnackBar // Inject MatSnackBar
  ) {}

  ngOnInit() {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/home']);
    }
  }
  
  onSubmit() {
    this.authService.login(this.email, this.password).subscribe({
      next: (res) => {
        this.authService.setToken(res.token);
        this.router.navigate(['/home']);
      },
      error: (err) => { // You can capture the error object if needed
        console.error('Login error:', err); // Log the actual error for debugging
        this.snackBar.open('Pogrešni podaci za logovanje!', 'Isključi', {
          duration: 3000, // Duration in milliseconds (e.g., 3 seconds)
          panelClass: ['snackbar-error'] // Optional: Add a custom CSS class for styling
        });
      }
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }
}