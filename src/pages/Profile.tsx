import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, LogOut, Wine, Heart } from "lucide-react";
import { useState, useEffect } from "react";

export default function Profile() {
  const { user, logout } = useAuth();
  const [favoritesCount, setFavoritesCount] = useState(0);

  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    setFavoritesCount(favorites.length);
  }, []);

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="bg-[var(--gradient-primary)] text-primary-foreground p-4 shadow-[var(--shadow-drink)]">
        <div className="max-w-lg mx-auto">
          <h1 className="text-xl font-semibold">Perfil</h1>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-lg mx-auto p-4">
        {/* User Info */}
        <Card className="mb-6 bg-[var(--gradient-card)] border-border shadow-[var(--shadow-card)]">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto mb-4 w-20 h-20 rounded-full bg-[var(--gradient-primary)] flex items-center justify-center">
              <User className="w-10 h-10 text-primary-foreground" />
            </div>
            <CardTitle className="text-xl text-foreground">{user?.name}</CardTitle>
            <p className="text-muted-foreground">{user?.email}</p>
          </CardHeader>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Card className="bg-[var(--gradient-card)] border-border">
            <CardContent className="p-4 text-center">
              <Wine className="w-8 h-8 text-primary mx-auto mb-2" />
              <p className="text-2xl font-bold text-foreground">∞</p>
              <p className="text-sm text-muted-foreground">Receitas Disponíveis</p>
            </CardContent>
          </Card>
          
          <Card className="bg-[var(--gradient-card)] border-border">
            <CardContent className="p-4 text-center">
              <Heart className="w-8 h-8 text-accent mx-auto mb-2" />
              <p className="text-2xl font-bold text-foreground">{favoritesCount}</p>
              <p className="text-sm text-muted-foreground">Receitas Favoritas</p>
            </CardContent>
          </Card>
        </div>

        {/* About App */}
        <Card className="mb-6 bg-[var(--gradient-card)] border-border">
          <CardHeader>
            <CardTitle className="text-lg text-foreground">Sobre o Easy Drink</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">
              Descubra milhares de receitas de drinks deliciosos, salve seus favoritos e 
              aprenda a fazer coquetéis incríveis. Todas as receitas são fornecidas pela 
              The Cocktail DB, uma base de dados completa e gratuita.
            </p>
          </CardContent>
        </Card>

        {/* Logout Button */}
        <Button 
          onClick={handleLogout}
          variant="destructive"
          className="w-full"
          size="lg"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sair da Conta
        </Button>
      </main>
    </div>
  );
}