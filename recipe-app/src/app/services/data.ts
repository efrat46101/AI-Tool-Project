import { Injectable } from '@angular/core';
import { User } from '../models/user.interface';
import { Recipe } from '../models/recipe.interface';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private readonly USERS_KEY = 'recipe_app_users';
  private readonly RECIPES_KEY = 'recipe_app_recipes';
  private readonly CURRENT_USER_KEY = 'recipe_app_current_user';

  private synth = window.speechSynthesis;
  private utterance: SpeechSynthesisUtterance | null = null;
  private instructions: string[] = [];
  private currentIndex = 0;
  private isPaused = false;
  private delay = 2000;

  constructor() {
    this.initializeData();
  }

  private initializeData(): void {
    if (!localStorage.getItem(this.USERS_KEY)) {
      const mockUsers: User[] = [
        {
          id: '1',
          username: 'admin',
          password: '123456',
          settings: { readingDelay: 2000, darkMode: false }
        },
        {
          id: '2',
          username: 'user',
          password: 'password',
          settings: { readingDelay: 1500, darkMode: true }
        }
      ];
      this.saveUsers(mockUsers);
    }

    if (!localStorage.getItem(this.RECIPES_KEY)) {
      const mockRecipes: Recipe[] = [
        {
          id: '1',
          title: 'פסטה קרבונרה',
          ingredients: ['500 גרם פסטה', '200 גרם בייקון', '4 ביצים', '100 גרם פרמזן', 'שום', 'פלפל שחור'],
          instructions: ['הרתיחו מים והכניסו את הפסטה', 'טגנו את הבייקון עד שהוא פריך', 'טרפו את הביצים עם הפרמזן', 'ערבבו הכל ביחד', 'הגישו חם'],
          prepTime: 10,
          cookTime: 20,
          servings: 4,
          imageUrl: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=800&h=600&fit=crop&q=80'
        },
        {
          id: '2',
          title: 'סלט יווני',
          ingredients: ['עגבניות', 'מלפפון', 'בצל סגול', 'גבינת פטה', 'זיתים', 'שמן זית', 'לימון'],
          instructions: ['חתכו את הירקות לקוביות', 'הוסיפו זיתים ופטה', 'תבלו בשמן זית ולימון', 'ערבבו והגישו'],
          prepTime: 15,
          cookTime: 0,
          servings: 4,
          imageUrl: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800&h=600&fit=crop&q=80'
        },
        {
          id: '3',
          title: 'עוגת שוקולד',
          ingredients: ['200 גרם שוקולד מריר', '150 גרם חמאה', '4 ביצים', '200 גרם סוכר', '100 גרם קמח'],
          instructions: ['המיסו שוקולד וחמאה', 'הוסיפו סוכר וביצים', 'הוסיפו קמח ועירבבו', 'אפו ב-180 מעלות למשך 25 דקות', 'הצטננו והגישו'],
          prepTime: 15,
          cookTime: 25,
          servings: 8,
          imageUrl: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&h=600&fit=crop&q=80'
        },
        {
          id: '4',
          title: 'פיצה ביתית',
          ingredients: ['בצק פיצה', 'רוטב עגבניות', 'גבינת מוצרלה', 'זיתים', 'פטריות', 'בזיליקום'],
          instructions: ['רדדו את הבצק', 'מרחו רוטב עגבניות', 'פזרו גבינה ותוספות', 'אפו ב-220 מעלות למשך 15 דקות', 'הגישו חם'],
          prepTime: 20,
          cookTime: 15,
          servings: 4,
          imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&h=600&fit=crop&q=80'
        },
        {
          id: '5',
          title: 'סושי ביתי',
          ingredients: ['אורז סושי', 'נורי', 'סלמון', 'אבוקדו', 'מלפפון', 'רוטב סויה'],
          instructions: ['בשלו את האורז', 'פרשו נורי על מחצלת', 'הניחו אורז ומילוי', 'גלגלו בזהירות', 'חתכו לפרוסות והגישו'],
          prepTime: 30,
          cookTime: 20,
          servings: 3,
          imageUrl: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800&h=600&fit=crop&q=80'
        },
        {
          id: '6',
          title: 'המבורגר עסיסי',
          ingredients: ['בשר טחון', 'לחמניות', 'חסה', 'עגבנייה', 'בצל', 'מלפפון חמוץ', 'רוטב'],
          instructions: ['עצבו קציצות מהבשר', 'צלו על אש חזקה', 'קלו את הלחמניות', 'הרכיבו עם הירקות', 'הגישו עם צ׳יפס'],
          prepTime: 15,
          cookTime: 10,
          servings: 4,
          imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&h=600&fit=crop&q=80'
        },
        {
          id: '7',
          title: 'שקשוקה ביתית',
          ingredients: ['6 ביצים', '4 עגבניות', 'בצל', 'פלפל אדום', 'שום', 'כמון', 'פפריקה', 'פטרוזיליה'],
          instructions: ['טגנו בצל ופלפל עד שמזהיבים', 'הוסיפו עגבניות ותבלינים', 'בשלו 10 דקות עד שמתעבה', 'צרו גומות והוסיפו ביצים', 'בשלו עד שהביצים מתקשות', 'קשטו בפטרוזיליה והגישו'],
          prepTime: 10,
          cookTime: 20,
          servings: 3,
          imageUrl: 'https://images.unsplash.com/photo-1607532941433-304659e8198a?w=800&h=600&fit=crop&q=80'
        },
        {
          id: '8',
          title: 'לזניה ביתית',
          ingredients: ['רצועות לזניה', '500 גרם בשר טחון', 'רוטב עגבניות', 'בשמל', 'גבינת מוצרלה', 'פרמזן', 'בצל', 'שום'],
          instructions: ['הכינו רוטב בולונז עם הבשר', 'הכינו רוטב בשמל', 'שכבו רוטב בולונז ורצועות לזניה', 'הוסיפו בשמל וגבינה', 'חזרו על השכבות', 'אפו ב-180 מעלות למשך 40 דקות'],
          prepTime: 30,
          cookTime: 40,
          servings: 6,
          imageUrl: 'https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=800&h=600&fit=crop&q=80'
        },
        {
          id: '9',
          title: 'פד תאי',
          ingredients: ['אטריות אורז', 'חזה עוף', 'ביצה', 'נבטים', 'בוטנים קלויים', 'רוטב דגים', 'רוטב טמרינד', 'שום', 'בצל ירוק'],
          instructions: ['השרו את האטריות במים חמים', 'טגנו עוף חתוך לרצועות', 'הוסיפו שום וביצה', 'הוסיפו אטריות ורטבים', 'ערבבו על אש גבוהה', 'הגישו עם נבטים ובוטנים'],
          prepTime: 20,
          cookTime: 15,
          servings: 2,
          imageUrl: 'https://images.unsplash.com/photo-1559314809-0d155014e29e?w=800&h=600&fit=crop&q=80'
        }
      ];
      this.saveRecipes(mockRecipes);
    }
  }

  // User operations
  getUsers(): User[] {
    const users = localStorage.getItem(this.USERS_KEY);
    return users ? JSON.parse(users) : [];
  }

  saveUsers(users: User[]): void {
    localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
  }

  getUserByUsername(username: string): User | undefined {
    return this.getUsers().find(u => u.username === username);
  }

  getCurrentUser(): User | null {
    const userId = localStorage.getItem(this.CURRENT_USER_KEY);
    if (!userId) return null;
    return this.getUsers().find(u => u.id === userId) || null;
  }

  setCurrentUser(userId: string): void {
    localStorage.setItem(this.CURRENT_USER_KEY, userId);
  }

  logout(): void {
    localStorage.removeItem(this.CURRENT_USER_KEY);
  }

  updateUserSettings(userId: string, settings: Partial<User['settings']>): void {
    const users = this.getUsers();
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex !== -1) {
      users[userIndex].settings = { ...users[userIndex].settings, ...settings };
      this.saveUsers(users);
    }
  }

  // Recipe operations
  getRecipes(): Recipe[] {
    const recipes = localStorage.getItem(this.RECIPES_KEY);
    return recipes ? JSON.parse(recipes) : [];
  }

  saveRecipes(recipes: Recipe[]): void {
    localStorage.setItem(this.RECIPES_KEY, JSON.stringify(recipes));
  }

  getRecipeById(id: string): Recipe | undefined {
    return this.getRecipes().find(r => r.id === id);
  }

  addRecipe(recipe: Recipe): void {
    const recipes = this.getRecipes();
    recipes.push(recipe);
    this.saveRecipes(recipes);
  }

  updateRecipe(id: string, updatedRecipe: Partial<Recipe>): void {
    const recipes = this.getRecipes();
    const index = recipes.findIndex(r => r.id === id);
    if (index !== -1) {
      recipes[index] = { ...recipes[index], ...updatedRecipe };
      this.saveRecipes(recipes);
    }
  }

  deleteRecipe(id: string): void {
    const recipes = this.getRecipes().filter(r => r.id !== id);
    this.saveRecipes(recipes);
  }

  // Voice Engine
  private currentCallback: ((index: number) => void) | null = null;

  private speakLine(text: string): void {
    this.utterance = new SpeechSynthesisUtterance(text);
    this.utterance.lang = 'he-IL';
    this.utterance.onend = () => {
      if (!this.isPaused && this.currentIndex < this.instructions.length - 1) {
        setTimeout(() => {
          this.currentIndex++;
          if (this.currentCallback) {
            this.currentCallback(this.currentIndex);
          }
          this.speakLine(this.instructions[this.currentIndex]);
        }, this.delay);
      } else if (this.currentIndex >= this.instructions.length - 1) {
        this.currentIndex = -1;
        if (this.currentCallback) {
          this.currentCallback(-1);
        }
      }
    };
    this.synth.speak(this.utterance);
  }

  play(instructions: string[]): void {
    const user = this.getCurrentUser();
    if (user) {
      this.delay = user.settings.readingDelay;
    }

    if (this.isPaused) {
      this.isPaused = false;
      this.synth.resume();
    } else {
      this.instructions = instructions;
      this.currentIndex = 0;
      this.isPaused = false;
      if (this.currentCallback) {
        this.currentCallback(this.currentIndex);
      }
      this.speakLine(this.instructions[this.currentIndex]);
    }
  }

  resumeWithCallback(callback: (index: number) => void): void {
    this.currentCallback = callback;
    if (this.isPaused) {
      this.isPaused = false;
      this.synth.resume();
    }
  }

  playWithCallback(instructions: string[], callback: (index: number) => void): void {
    this.currentCallback = callback;
    const user = this.getCurrentUser();
    if (user) {
      this.delay = user.settings.readingDelay;
    }

    this.instructions = instructions;
    this.currentIndex = 0;
    this.isPaused = false;
    if (this.currentCallback) {
      this.currentCallback(this.currentIndex);
    }
    this.speakLine(this.instructions[this.currentIndex]);
  }

  pause(): void {
    if (this.synth.speaking && !this.isPaused) {
      this.isPaused = true;
      this.synth.pause();
    }
  }

  stop(): void {
    this.synth.cancel();
    this.isPaused = false;
    this.currentIndex = 0;
    this.instructions = [];
    this.currentCallback = null;
  }

  isPlaying(): boolean {
    return this.synth.speaking && !this.isPaused;
  }

  isPausedState(): boolean {
    return this.isPaused;
  }
}
