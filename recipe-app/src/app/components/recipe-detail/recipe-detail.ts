import { Component, OnInit, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../../services/data';
import { Recipe } from '../../models/recipe.interface';

@Component({
  selector: 'app-recipe-detail',
  imports: [CommonModule],
  templateUrl: './recipe-detail.html',
  styleUrl: './recipe-detail.scss',
})
export class RecipeDetail implements OnInit {
  recipe: Recipe | null = null;
  isPlaying = false;
  isPaused = false;
  currentStepIndex = -1;
  selectedImageFile: File | null = null;
  imagePreview: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dataService: DataService,
    private ngZone: NgZone
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.recipe = this.dataService.getRecipeById(id) || null;
      if (!this.recipe) {
        this.router.navigate(['/recipes']);
      }
    }
  }

  goBack(): void {
    this.dataService.stop();
    this.currentStepIndex = -1;
    this.router.navigate(['/recipes']);
  }

  playRecipe(): void {
    if (this.recipe) {
      this.currentStepIndex = 0;
      this.dataService.playWithCallback(this.recipe.instructions, (index: number) => {
        this.ngZone.run(() => {
          this.currentStepIndex = index;
          console.log('Current step index:', index);
        });
      });
      this.isPlaying = true;
      this.isPaused = false;
    }
  }

  pauseRecipe(): void {
    this.dataService.pause();
    this.isPaused = true;
    this.isPlaying = false;
  }

  stopRecipe(): void {
    this.dataService.stop();
    this.isPlaying = false;
    this.isPaused = false;
    this.currentStepIndex = -1;
  }

  resumeRecipe(): void {
    if (this.recipe) {
      this.dataService.resumeWithCallback((index: number) => {
        this.ngZone.run(() => {
          this.currentStepIndex = index;
          console.log('Current step index (resumed):', index);
        });
      });
      this.isPlaying = true;
      this.isPaused = false;
    }
  }
}
