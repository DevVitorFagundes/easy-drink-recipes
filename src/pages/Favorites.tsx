import { useState, useEffect } from "react";
import { DrinkCard } from "@/components/DrinkCard";
import { useNavigate } from "react-router-dom";
import { Heart, Loader2 } from "lucide-react";

interface Drink {
  idDrink: string;
  strDrink: string;
  strDrinkThumb: string;
  strCategory: string;
}

export default function Favorites() {
  const [drinks, setDrinks] = useState<Drink[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchFavorites();
    
    // Listen for storage changes to update favorites in real-time
    const handleStorageChange = () => {
      fetchFavorites();
    };
    
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const fetchFavorites = async () => {
    setIsLoading(true);
    try {
      const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
      
      if (favorites.length === 0) {
        setDrinks([]);
        setIsLoading(false);
        return;
      }

      // Fetch details for each favorite drink
      const drinkPromises = favorites.map((id: string) =>
        fetch(`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${id}`)
          .then(res => res.json())
          .then(data => data.drinks?.[0])
          .catch(() => null)
      );

      const results = await Promise.all(drinkPromises);
      const validDrinks = results.filter(Boolean);
      setDrinks(validDrinks);
    } catch (error) {
      console.error("Error fetching favorites:", error);
      setDrinks([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Refresh favorites when returning to this page
  useEffect(() => {
    const handleFocus = () => {
      fetchFavorites();
    };
    
    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, []);

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="bg-card border-b border-border p-4 sticky top-0 z-10 shadow-sm">
        <div className="max-w-lg mx-auto">
          <h1 className="text-xl font-semibold text-foreground">Meus Favoritos</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {drinks.length} {drinks.length === 1 ? "receita salva" : "receitas salvas"}
          </p>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-lg mx-auto p-4">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">Carregando favoritos...</p>
          </div>
        ) : drinks.length === 0 ? (
          <div className="text-center py-12">
            <Heart className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h2 className="text-lg font-medium text-foreground mb-2">Nenhum favorito ainda</h2>
            <p className="text-muted-foreground mb-6">
              Comece explorando receitas e salvando suas favoritas
            </p>
            <button
              onClick={() => navigate("/")}
              className="text-primary hover:text-primary-glow transition-colors font-medium"
            >
              Descobrir receitas
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {drinks.map((drink) => (
              <DrinkCard
                key={drink.idDrink}
                drink={drink}
                onClick={() => navigate(`/drink/${drink.idDrink}`)}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}