import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DataService } from '../../services/data';
import { User } from '../../models/user.interface';

@Component({
  selector: 'app-settings',
  imports: [CommonModule, FormsModule],
  templateUrl: './settings.html',
  styleUrl: './settings.scss',
})
export class Settings implements OnInit {
  currentUser: User | null = null;
  readingDelay = 2000;
  darkMode = false;

  constructor(private dataService: DataService, private router: Router) {}

  ngOnInit(): void {
    this.currentUser = this.dataService.getCurrentUser();
    if (this.currentUser) {
      this.readingDelay = this.currentUser.settings.readingDelay;
      this.darkMode = this.currentUser.settings.darkMode;
      this.applyDarkMode();
    }
  }

  saveSettings(): void {
    if (this.currentUser) {
      this.dataService.updateUserSettings(this.currentUser.id, {
        readingDelay: this.readingDelay,
        darkMode: this.darkMode
      });
      this.applyDarkMode();
      alert('ההגדרות נשמרו בהצלחה!');
    }
  }

  applyDarkMode(): void {
    if (this.darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }

  goBack(): void {
    this.router.navigate(['/recipes']);
  }
}
