"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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
import { Separator } from "@/components/ui/separator";
import {
  Heart,
  ArrowLeft,
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Calendar,
  PawPrint,
  Shield,
} from "lucide-react";
import { ApiService, AuthService, type Usuario } from "@/lib/api";

export default function PerfilPage() {
  const router = useRouter();
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Verificar se usuário está logado
    if (!AuthService.isAuthenticated()) {
      router.push("/login");
      return;
    }

    fetchUsuario();
  }, [router]);

  const fetchUsuario = async () => {
    try {
      const data = await ApiService.buscarUsuarioLogado();
      setUsuario(data);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Erro ao carregar perfil"
      );
      if (error instanceof Error && error.message.includes("Sessão expirada")) {
        router.push("/login?message=Sessão expirada. Faça login novamente.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    AuthService.clearTokens();
    router.push("/");
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Heart className="h-12 w-12 text-orange-500 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-600">Carregando perfil...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="pt-6 text-center">
            <div className="text-red-500 mb-4">
              <User className="h-12 w-12 mx-auto" />
            </div>
            <h2 className="text-xl font-semibold mb-2">
              Erro ao carregar perfil
            </h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <div className="space-y-2">
              <Link href="/login">
                <Button className="w-full">Fazer Login</Button>
              </Link>
              <Link href="/">
                <Button variant="outline" className="w-full">
                  Voltar ao Início
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!usuario) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link
                href="/"
                className="inline-flex items-center text-orange-600 hover:text-orange-700"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar ao início
              </Link>
              <div className="flex items-center space-x-2">
                <Heart className="h-6 w-6 text-orange-500" />
                <h1 className="text-xl font-bold text-gray-900">Meu Perfil</h1>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {usuario.role === "Admin" && (
                <Link href="/admin">
                  <Button variant="outline" size="sm">
                    <Shield className="h-4 w-4 mr-2" />
                    Admin
                  </Button>
                </Link>
              )}
              <Button variant="outline" size="sm" onClick={handleLogout}>
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Cabeçalho do Perfil */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center space-x-4">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center">
                <User className="h-8 w-8 text-orange-500" />
              </div>
              <div className="flex-1">
                <CardTitle className="text-2xl">{usuario.nome}</CardTitle>
                <CardDescription className="text-lg">
                  {usuario.email}
                </CardDescription>
                <div className="flex items-center space-x-2 mt-2">
                  <Badge
                    variant={usuario.role === "Admin" ? "default" : "secondary"}
                  >
                    {usuario.role === "Admin" ? (
                      <>
                        <Shield className="h-3 w-3 mr-1" />
                        Administrador
                      </>
                    ) : (
                      <>
                        <User className="h-3 w-3 mr-1" />
                        Usuário
                      </>
                    )}
                  </Badge>
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Informações Pessoais */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="h-5 w-5 mr-2" />
                Informações Pessoais
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Nome Completo
                </label>
                <p className="text-gray-900">{usuario.nome}</p>
              </div>
              <Separator />
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Email
                </label>
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-2 text-gray-400" />
                  <p className="text-gray-900">{usuario.email}</p>
                </div>
              </div>
              <Separator />
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Telefone
                </label>
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-2 text-gray-400" />
                  <p className="text-gray-900">{usuario.telefone}</p>
                </div>
              </div>
              <Separator />
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Idade
                </label>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                  <p className="text-gray-900">{usuario.idade} anos</p>
                </div>
              </div>
              <Separator />
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Profissão
                </label>
                <div className="flex items-center">
                  <Briefcase className="h-4 w-4 mr-2 text-gray-400" />
                  <p className="text-gray-900">{usuario.profissao}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Endereço */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                Endereço
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Rua e Número
                </label>
                <p className="text-gray-900">
                  {usuario.rua}, {usuario.numero}
                </p>
              </div>
              <Separator />
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Bairro
                </label>
                <p className="text-gray-900">{usuario.bairro}</p>
              </div>
              <Separator />
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Cidade
                </label>
                <p className="text-gray-900">{usuario.cidade}</p>
              </div>
              <Separator />
              <div>
                <label className="text-sm font-medium text-gray-500">CEP</label>
                <p className="text-gray-900">{usuario.cep}</p>
              </div>
            </CardContent>
          </Card>

          {/* Preferências de Adoção */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center">
                <PawPrint className="h-5 w-5 mr-2" />
                Preferências de Adoção
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Preferência de Animal
                  </label>
                  <p className="text-gray-900 capitalize">
                    {usuario.preferencia_animal}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Tamanho Preferido
                  </label>
                  <p className="text-gray-900 capitalize">
                    {usuario.tamanho_animal}
                  </p>
                </div>
              </div>
              <Separator />
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Raça Preferida
                </label>
                <p className="text-gray-900">
                  {usuario.raca_animal || "Sem preferência específica"}
                </p>
              </div>
              <Separator />
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Experiência com Animais
                </label>
                <p className="text-gray-900 whitespace-pre-wrap">
                  {usuario.experiencia_animais}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Informações da Conta */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Informações da Conta</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Conta criada em
                  </label>
                  <p className="text-gray-900">
                    {formatDate(usuario.criado_em)}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Última atualização
                  </label>
                  <p className="text-gray-900">
                    {formatDate(usuario.atualizado_em)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
