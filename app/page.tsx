"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Heart,
  MapPin,
  Phone,
  Mail,
  Users,
  Shield,
  Home,
  User,
} from "lucide-react";
import { ApiService, AuthService, type Pet } from "@/lib/api";

export default function HomePage() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Verificar se usuário está logado
    if (AuthService.isAuthenticated()) {
      setUser({ token: AuthService.getAccessToken() });
    }

    // Buscar pets disponíveis
    fetchPets();
  }, []);

  const fetchPets = async () => {
    try {
      const data = await ApiService.buscarAnimaisDisponiveis();
      setPets(data);
    } catch (error) {
      console.error("Erro ao buscar pets:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    AuthService.clearTokens();
    setUser(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Heart className="h-8 w-8 text-orange-500" />
              <h1 className="text-2xl font-bold text-gray-900">PetAdopt</h1>
            </div>
            <nav className="flex items-center space-x-4">
              {user ? (
                <>
                  <Link href="/perfil">
                    <Button variant="outline" size="sm">
                      <User className="h-4 w-4 mr-2" />
                      Perfil
                    </Button>
                  </Link>
                  <Link href="/admin">
                    <Button variant="outline" size="sm">
                      <Shield className="h-4 w-4 mr-2" />
                      Admin
                    </Button>
                  </Link>
                  <Button variant="outline" size="sm" onClick={handleLogout}>
                    Sair
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/login">
                    <Button variant="outline" size="sm">
                      Login
                    </Button>
                  </Link>
                  <Link href="/cadastro">
                    <Button size="sm">Cadastrar</Button>
                  </Link>
                </>
              )}
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Encontre seu novo melhor amigo
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Conectamos pets que precisam de um lar com famílias que precisam de
            amor incondicional
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="#pets">
              <Button size="lg" className="bg-orange-500 hover:bg-orange-600">
                <Heart className="h-5 w-5 mr-2" />
                Ver Pets Disponíveis
              </Button>
            </Link>
            <Link href="/cadastro">
              <Button size="lg" variant="outline">
                Quero Adotar
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Como Adotar */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Como Adotar
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-orange-500" />
              </div>
              <h4 className="text-xl font-semibold mb-2">1. Cadastre-se</h4>
              <p className="text-gray-600">
                Crie sua conta e preencha suas informações para que possamos
                conhecer você melhor
              </p>
            </div>
            <div className="text-center">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-orange-500" />
              </div>
              <h4 className="text-xl font-semibold mb-2">2. Escolha seu Pet</h4>
              <p className="text-gray-600">
                Navegue pelos pets disponíveis e encontre aquele que combina com
                seu perfil
              </p>
            </div>
            <div className="text-center">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Home className="h-8 w-8 text-orange-500" />
              </div>
              <h4 className="text-xl font-semibold mb-2">3. Leve para Casa</h4>
              <p className="text-gray-600">
                Entre em contato conosco e finalize o processo de adoção
                responsável
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pets Disponíveis */}
      <section id="pets" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Pets Disponíveis para Adoção
          </h3>

          {loading ? (
            <div className="text-center">
              <p className="text-gray-600">Carregando pets...</p>
            </div>
          ) : pets.length === 0 ? (
            <div className="text-center">
              <p className="text-gray-600">Nenhum pet disponível no momento.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pets.map((pet) => (
                <Card
                  key={pet.id}
                  className="hover:shadow-lg transition-shadow"
                >
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl">{pet.nome}</CardTitle>
                        <CardDescription className="text-sm text-gray-500">
                          {pet.raca} • {pet.idade}{" "}
                          {pet.idade === 1 ? "ano" : "anos"}
                        </CardDescription>
                      </div>
                      <Badge variant="secondary">{pet.sexo}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="font-medium">Tamanho:</span>{" "}
                        {pet.tamanho}
                      </div>
                      <div>
                        <span className="font-medium">Peso:</span> {pet.peso}kg
                      </div>
                      <div>
                        <span className="font-medium">Cor:</span> {pet.cor}
                      </div>
                      <div className="col-span-2">
                        <span className="font-medium">Temperamento:</span>{" "}
                        {pet.temperamento}
                      </div>
                    </div>

                    <div className="pt-2 border-t">
                      <div className="flex items-center text-sm text-gray-600 mb-1">
                        <MapPin className="h-4 w-4 mr-1" />
                        {pet.cidade}, {pet.bairro}
                      </div>
                      <div className="flex items-center text-sm text-gray-600 mb-1">
                        <Phone className="h-4 w-4 mr-1" />
                        {pet.telefone}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Mail className="h-4 w-4 mr-1" />
                        {pet.email}
                      </div>
                    </div>

                    <Button className="w-full bg-orange-500 hover:bg-orange-600">
                      <Heart className="h-4 w-4 mr-2" />
                      Quero Adotar
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Heart className="h-6 w-6 text-orange-500" />
                <h4 className="text-xl font-bold">PetAdopt</h4>
              </div>
              <p className="text-gray-400">
                Conectando pets e famílias através do amor e cuidado
                responsável.
              </p>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Contato</h5>
              <div className="space-y-2 text-gray-400">
                <p>📧 contato@petadopt.com</p>
                <p>📱 (11) 99999-9999</p>
                <p>📍 São Paulo, SP</p>
              </div>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Links Úteis</h5>
              <div className="space-y-2">
                <Link
                  href="/cadastro"
                  className="block text-gray-400 hover:text-white"
                >
                  Cadastrar-se
                </Link>
                <Link
                  href="/login"
                  className="block text-gray-400 hover:text-white"
                >
                  Login
                </Link>
                <Link
                  href="#pets"
                  className="block text-gray-400 hover:text-white"
                >
                  Pets Disponíveis
                </Link>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 PetAdopt. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
