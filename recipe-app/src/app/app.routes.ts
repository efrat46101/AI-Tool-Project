import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { RecipeList } from './components/recipe-list/recipe-list';
import { RecipeDetail } from './components/recipe-detail/recipe-detail';
import { Settings } from './components/settings/settings';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'recipes', component: RecipeList, canActivate: [authGuard] },
  { path: 'recipe/:id', component: RecipeDetail, canActivate: [authGuard] },
  { path: 'settings', component: Settings, canActivate: [authGuard] },
  { path: '**', redirectTo: '/login' }
];
