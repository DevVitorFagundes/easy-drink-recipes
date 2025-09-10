import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Heart, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DrinkDetail {
  idDrink: string;
  strDrink: string;
  strDrinkThumb: string;
  strCategory: string;
  strAlcoholic: string;
  strInstructions: string;
  strGlass: string;
  [key: string]: string;
}

export default function DrinkDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [drink, setDrink] = useState<DrinkDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (id) {
      fetchDrinkDetail(id);
      checkIfFavorite(id);
    }
  }, [id]);

  const fetchDrinkDetail = async (drinkId: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${drinkId}`
      );
      const data = await response.json();
      setDrink(data.drinks?.[0] || null);
    } catch (error) {
      console.error("Error fetching drink detail:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const checkIfFavorite = (drinkId: string) => {
    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    setIsFavorite(favorites.includes(drinkId));
  };

  const toggleFavorite = () => {
    if (!drink) return;

    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    
    if (isFavorite) {
      const newFavorites = favorites.filter((id: string) => id !== drink.idDrink);
      localStorage.setItem("favorites", JSON.stringify(newFavorites));
      setIsFavorite(false);
      toast({
        title: "Removido dos favoritos",
        description: `${drink.strDrink} foi removido dos seus favoritos`
      });
    } else {
      favorites.push(drink.idDrink);
      localStorage.setItem("favorites", JSON.stringify(favorites));
      setIsFavorite(true);
      toast({
        title: "Adicionado aos favoritos",
        description: `${drink.strDrink} foi adicionado aos seus favoritos`
      });
    }
  };

  const getIngredients = () => {
    if (!drink) return [];
    
    const ingredients = [];
    for (let i = 1; i <= 15; i++) {
      const ingredient = drink[`strIngredient${i}`];
      const measure = drink[`strMeasure${i}`];
      if (ingredient && ingredient.trim()) {
        ingredients.push({
          name: ingredient.trim(),
          measure: measure?.trim() || ""
        });
      }
    }
    return ingredients;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Carregando receita...</p>
        </div>
      </div>
    );
  }

  if (!drink) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-xl font-semibold text-foreground mb-2">Receita não encontrada</h1>
          <Button onClick={() => navigate("/")} variant="outline">
            Voltar ao início
          </Button>
        </div>
      </div>
    );
  }

  const ingredients = getIngredients();

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="relative">
        <div className="absolute top-4 left-4 z-10">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => navigate(-1)}
            className="rounded-full w-10 h-10 p-0 bg-card/80 backdrop-blur-sm border border-border"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="absolute top-4 right-4 z-10">
          <Button
            variant="secondary"
            size="sm"
            onClick={toggleFavorite}
            className="rounded-full w-10 h-10 p-0 bg-card/80 backdrop-blur-sm border border-border"
          >
            <Heart 
              className={`w-4 h-4 ${isFavorite ? "fill-accent text-accent" : "text-muted-foreground"}`} 
            />
          </Button>
        </div>

        <img 
          src={drink.strDrinkThumb} 
          alt={drink.strDrink}
          className="w-full h-80 object-cover"
        />
      </header>

      {/* Content */}
      <main className="max-w-lg mx-auto p-4">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground mb-2">{drink.strDrink}</h1>
          <div className="flex gap-2 mb-3">
            <Badge variant="secondary">{drink.strCategory}</Badge>
            <Badge variant="outline">{drink.strAlcoholic}</Badge>
            {drink.strGlass && <Badge variant="outline">{drink.strGlass}</Badge>}
          </div>
        </div>

        {/* Ingredients */}
        <Card className="mb-6 bg-[var(--gradient-card)] border-border">
          <CardContent className="p-4">
            <h2 className="text-lg font-semibold text-foreground mb-3">Ingredientes</h2>
            <div className="space-y-2">
              {ingredients.map((ingredient, index) => (
                <div key={index} className="flex justify-between items-center py-1">
                  <span className="text-foreground">{ingredient.name}</span>
                  {ingredient.measure && (
                    <span className="text-muted-foreground text-sm">{ingredient.measure}</span>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card className="bg-[var(--gradient-card)] border-border">
          <CardContent className="p-4">
            <h2 className="text-lg font-semibold text-foreground mb-3">Modo de Preparo</h2>
            <p className="text-foreground leading-relaxed whitespace-pre-line">
              {drink.strInstructions}
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}