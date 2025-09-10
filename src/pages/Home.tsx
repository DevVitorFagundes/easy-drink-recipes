import { useState, useEffect } from "react";
import { DrinkCard } from "@/components/DrinkCard";
import { useNavigate } from "react-router-dom";
import { Wine, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface Drink {
  idDrink: string;
  strDrink: string;
  strDrinkThumb: string;
  strCategory: string;
}

export default function Home() {
  const [drinks, setDrinks] = useState<Drink[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    fetchRandomDrinks();
  }, []);

  const fetchRandomDrinks = async () => {
    setIsLoading(true);
    try {
      // Fetch multiple random drinks
      const promises = Array.from({ length: 12 }, () =>
        fetch("https://www.thecocktaildb.com/api/json/v1/1/random.php").then(res => res.json())
      );
      
      const results = await Promise.all(promises);
      const fetchedDrinks = results
        .map(result => result.drinks?.[0])
        .filter(Boolean)
        .filter((drink, index, self) => 
          // Remove duplicates
          self.findIndex(d => d.idDrink === drink.idDrink) === index
        );
      
      setDrinks(fetchedDrinks);
    } catch (error) {
      console.error("Error fetching drinks:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="bg-[var(--gradient-primary)] text-primary-foreground p-4 shadow-[var(--shadow-drink)]">
        <div className="flex items-center justify-between max-w-lg mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary-foreground/20 flex items-center justify-center">
              <Wine className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Easy Drink</h1>
              <p className="text-sm opacity-90">Olá, {user?.name || "Usuário"}!</p>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-lg mx-auto p-4">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-foreground mb-2">Receitas em Destaque</h2>
          <p className="text-muted-foreground">Descubra novos drinks deliciosos</p>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">Carregando receitas...</p>
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