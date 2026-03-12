import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DataService } from '../../services/data';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  username = '';
  password = '';
  errorMessage = '';

  constructor(private dataService: DataService, private router: Router) {}

  onSubmit(): void {
    const user = this.dataService.getUserByUsername(this.username);
    if (user && user.password === this.password) {
      this.dataService.setCurrentUser(user.id);
      this.router.navigate(['/recipes']);
    } else {
      this.errorMessage = 'שם משתמש או סיסמה שגויים';
    }
  }
}
