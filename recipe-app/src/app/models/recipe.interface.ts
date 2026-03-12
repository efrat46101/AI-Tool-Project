export interface Recipe {
  id: string;
  title: string;
  ingredients: string[];
  instructions: string[];
  prepTime: number;
  cookTime: number;
  servings: number;
  imageUrl?: string;
}
