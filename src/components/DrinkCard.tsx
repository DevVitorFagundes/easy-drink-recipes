import { Card } from "@/components/ui/card";
import { Heart } from "lucide-react";
import { useState, useEffect } from "react";

interface DrinkCardProps {
  drink: {
    idDrink: string;
    strDrink: string;
    strDrinkThumb: string;
    strCategory: string;
  };
  onClick: () => void;
}

export function DrinkCard({ drink, onClick }: DrinkCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    setIsFavorite(favorites.includes(drink.idDrink));
  }, [drink.idDrink]);

  const toggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    
    if (isFavorite) {
      const newFavorites = favorites.filter((id: string) => id !== drink.idDrink);
      localStorage.setItem("favorites", JSON.stringify(newFavorites));
      setIsFavorite(false);
    } else {
      favorites.push(drink.idDrink);
      localStorage.setItem("favorites", JSON.stringify(favorites));
      setIsFavorite(true);
    }
  };

  return (
    <Card 
      className="overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-[var(--shadow-card)] hover:scale-[1.02] bg-[var(--gradient-card)]"
      onClick={onClick}
    >
      <div className="relative">
        <img 
          src={drink.strDrinkThumb} 
          alt={drink.strDrink}
          className="w-full h-48 object-cover"
        />
        <button
          onClick={toggleFavorite}
          className="absolute top-3 right-3 p-2 rounded-full bg-card/80 backdrop-blur-sm border border-border transition-colors hover:bg-card"
        >
          <Heart 
            size={18} 
            className={isFavorite ? "fill-accent text-accent" : "text-muted-foreground"} 
          />
        </button>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-foreground mb-1 line-clamp-1">{drink.strDrink}</h3>
        <p className="text-sm text-muted-foreground">{drink.strCategory}</p>
      </div>
    </Card>
  );
}