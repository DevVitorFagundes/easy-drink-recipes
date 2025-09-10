import { useState } from "react";
import { DrinkCard } from "@/components/DrinkCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Search as SearchIcon, Loader2 } from "lucide-react";

interface Drink {
  idDrink: string;
  strDrink: string;
  strDrinkThumb: string;
  strCategory: string;
}

export default function Search() {
  const [searchTerm, setSearchTerm] = useState("");
  const [drinks, setDrinks] = useState<Drink[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const navigate = useNavigate();

  const searchDrinks = async () => {
    if (!searchTerm.trim()) return;
    
    setIsLoading(true);
    setHasSearched(true);
    
    try {
      const response = await fetch(
        `https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${encodeURIComponent(searchTerm)}`
      );
      const data = await response.json();
      setDrinks(data.drinks || []);
    } catch (error) {
      console.error("Error searching drinks:", error);
      setDrinks([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    searchDrinks();
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="bg-card border-b border-border p-4 sticky top-0 z-10 shadow-sm">
        <div className="max-w-lg mx-auto">
          <h1 className="text-xl font-semibold text-foreground mb-4">Buscar Receitas</h1>
          
          <form onSubmit={handleSubmit} className="flex gap-2">
            <div className="flex-1 relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                type="text"
                placeholder="Nome do drink..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-input border-border"
              />
            </div>
            <Button 
              type="submit" 
              disabled={isLoading || !searchTerm.trim()}
              className="bg-primary hover:bg-primary-glow transition-colors"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Buscar"
              )}
            </Button>
          </form>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-lg mx-auto p-4">
        {!hasSearched ? (
          <div className="text-center py-12">
            <SearchIcon className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h2 className="text-lg font-medium text-foreground mb-2">Encontre seu drink ideal</h2>
            <p className="text-muted-foreground">Digite o nome de um drink para começar</p>
          </div>
        ) : isLoading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">Buscando receitas...</p>
          </div>
        ) : drinks.length === 0 ? (
          <div className="text-center py-12">
            <SearchIcon className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h2 className="text-lg font-medium text-foreground mb-2">Nenhum resultado encontrado</h2>
            <p className="text-muted-foreground">Tente buscar por outro nome</p>
          </div>
        ) : (
          <>
            <div className="mb-4">
              <p className="text-muted-foreground">
                {drinks.length} {drinks.length === 1 ? "resultado encontrado" : "resultados encontrados"}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {drinks.map((drink) => (
                <DrinkCard
                  key={drink.idDrink}
                  drink={drink}
                  onClick={() => navigate(`/drink/${drink.idDrink}`)}
                />
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}