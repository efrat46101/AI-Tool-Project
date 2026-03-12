import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DataService } from '../../services/data';
import { Recipe } from '../../models/recipe.interface';

@Component({
  selector: 'app-recipe-list',
  imports: [CommonModule, FormsModule],
  templateUrl: './recipe-list.html',
  styleUrl: './recipe-list.scss',
})
export class RecipeList implements OnInit {
  recipes: Recipe[] = [];
  filteredRecipes: Recipe[] = [];
  searchTerm = '';
  showAddModal = false;
  newRecipe: Recipe = this.getEmptyRecipe();
  selectedImageFile: File | null = null;
  imagePreview: string | null = null;

  constructor(private dataService: DataService, private router: Router) {}

  ngOnInit(): void {
    this.loadRecipes();
  }

  loadRecipes(): void {
    this.recipes = this.dataService.getRecipes();
    this.filteredRecipes = [...this.recipes];
  }

  onSearch(): void {
    const term = this.searchTerm.toLowerCase().trim();
    if (!term) {
      this.filteredRecipes = [...this.recipes];
    } else {
      this.filteredRecipes = this.recipes.filter(recipe =>
        recipe.title.toLowerCase().includes(term) ||
        recipe.ingredients.some(ing => ing.toLowerCase().includes(term))
      );
    }
  }

  viewRecipe(id: string): void {
    this.router.navigate(['/recipe', id]);
  }

  openAddModal(): void {
    this.newRecipe = this.getEmptyRecipe();
    this.selectedImageFile = null;
    this.imagePreview = null;
    this.showAddModal = true;
  }

  closeAddModal(): void {
    this.showAddModal = false;
    this.selectedImageFile = null;
    this.imagePreview = null;
  }

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedImageFile = input.files[0];
      
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        this.imagePreview = e.target?.result as string;
        this.newRecipe.imageUrl = this.imagePreview;
      };
      reader.readAsDataURL(this.selectedImageFile);
    }
  }

  removeImage(): void {
    this.selectedImageFile = null;
    this.imagePreview = null;
    this.newRecipe.imageUrl = undefined;
  }

  addRecipe(): void {
    if (this.newRecipe.title && this.newRecipe.ingredients.length > 0 && this.newRecipe.instructions.length > 0) {
      this.newRecipe.id = Date.now().toString();
      this.dataService.addRecipe(this.newRecipe);
      this.loadRecipes();
      this.closeAddModal();
    }
  }

  deleteRecipe(id: string, event: Event): void {
    event.stopPropagation();
    if (confirm('האם אתה בטוח שברצונך למחוק מתכון זה?')) {
      this.dataService.deleteRecipe(id);
      this.loadRecipes();
    }
  }

  goToSettings(): void {
    this.router.navigate(['/settings']);
  }

  logout(): void {
    this.dataService.logout();
    this.router.navigate(['/login']);
  }

  private getEmptyRecipe(): Recipe {
    return {
      id: '',
      title: '',
      ingredients: [''],
      instructions: [''],
      prepTime: 0,
      cookTime: 0,
      servings: 1
    };
  }

  addIngredient(): void {
    this.newRecipe.ingredients.push('');
  }

  removeIngredient(index: number): void {
    this.newRecipe.ingredients.splice(index, 1);
  }

  addInstruction(): void {
    this.newRecipe.instructions.push('');
  }

  removeInstruction(index: number): void {
    this.newRecipe.instructions.splice(index, 1);
  }

  trackByIndex(index: number): number {
    return index;
  }
}
