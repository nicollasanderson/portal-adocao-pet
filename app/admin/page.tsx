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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Heart,
  ArrowLeft,
  PawPrint,
  CheckCircle,
  Shield,
  AlertTriangle,
  Plus,
  Edit,
  Trash2,
} from "lucide-react";
import { ApiService, AuthService, type Pet, type Usuario } from "@/lib/api";
import { AnimalForm } from "@/components/admin/animal-form";
import { DeleteAnimalDialog } from "@/components/admin/delete-animal-dialog";

type ViewMode = "list" | "create" | "edit";

export default function AdminPage() {
  const router = useRouter();
  const [pets, setPets] = useState<Pet[]>([]);
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [selectedAnimal, setSelectedAnimal] = useState<Pet | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [animalToDelete, setAnimalToDelete] = useState<Pet | null>(null);

  useEffect(() => {
    // Verificar se usuário está logado
    if (!AuthService.isAuthenticated()) {
      router.push("/login");
      return;
    }

    checkAdminAccess();
  }, [router]);

  const checkAdminAccess = async () => {
    try {
      const adminUser = await AuthService.checkAdminPermission();

      if (!adminUser) {
        // Usuário não é admin
        setError(
          "Acesso negado. Você não tem permissão para acessar esta página."
        );
        return;
      }

      setUsuario(adminUser);
      await fetchPets();
    } catch (error) {
      setError("Erro ao verificar permissões. Faça login novamente.");
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    } finally {
      setLoading(false);
    }
  };

  const fetchPets = async () => {
    try {
      const data = await ApiService.buscarAnimais();
      setPets(data);
    } catch (error) {
      console.error("Erro ao buscar pets:", error);
    }
  };

  const handleLogout = () => {
    AuthService.clearTokens();
    router.push("/");
  };

  const handleCreateAnimal = () => {
    setSelectedAnimal(null);
    setViewMode("create");
  };

  const handleEditAnimal = (animal: Pet) => {
    setSelectedAnimal(animal);
    setViewMode("edit");
  };

  const handleDeleteAnimal = (animal: Pet) => {
    setAnimalToDelete(animal);
    setDeleteDialogOpen(true);
  };

  const handleFormSuccess = async () => {
    await fetchPets();
    setViewMode("list");
    setSelectedAnimal(null);
  };

  const handleFormCancel = () => {
    setViewMode("list");
    setSelectedAnimal(null);
  };

  const handleDeleteSuccess = async () => {
    await fetchPets();
    setAnimalToDelete(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR");
  };

  // Tela de loading
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Shield className="h-12 w-12 text-orange-500 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-600">Verificando permissões...</p>
        </div>
      </div>
    );
  }

  // Tela de erro/acesso negado
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="pt-6 text-center">
            <div className="text-red-500 mb-4">
              <AlertTriangle className="h-12 w-12 mx-auto" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Acesso Restrito</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <div className="space-y-2">
              <Link href="/">
                <Button className="w-full">Voltar ao Início</Button>
              </Link>
              <Link href="/perfil">
                <Button variant="outline" className="w-full">
                  Ver Meu Perfil
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

  const petsDisponiveis = pets.filter((pet) => !pet.adotado);
  const petsAdotados = pets.filter((pet) => pet.adotado);

  // Renderizar formulário de criação/edição
  if (viewMode === "create" || viewMode === "edit") {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-2">
                <Heart className="h-6 w-6 text-orange-500" />
                <h1 className="text-xl font-bold text-gray-900">
                  {viewMode === "create" ? "Cadastrar Animal" : "Editar Animal"}
                </h1>
              </div>
              <div className="flex items-center space-x-2">
                <div className="text-sm text-gray-600">
                  Olá, <span className="font-medium">{usuario.nome}</span>
                </div>
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  Sair
                </Button>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <AnimalForm
            animal={selectedAnimal}
            onSuccess={handleFormSuccess}
            onCancel={handleFormCancel}
          />
        </div>
      </div>
    );
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
                Voltar ao site
              </Link>
              <div className="flex items-center space-x-2">
                <Heart className="h-6 w-6 text-orange-500" />
                <h1 className="text-xl font-bold text-gray-900">
                  Painel Administrativo
                </h1>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="text-sm text-gray-600">
                Olá, <span className="font-medium">{usuario.nome}</span>
              </div>
              <Link href="/perfil">
                <Button variant="outline" size="sm">
                  Perfil
                </Button>
              </Link>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total de Pets
              </CardTitle>
              <PawPrint className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pets.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Disponíveis</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {petsDisponiveis.length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Adotados</CardTitle>
              <Heart className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-500">
                {petsAdotados.length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Botão Criar Animal */}
        <div className="mb-6">
          <Button
            onClick={handleCreateAnimal}
            className="bg-orange-500 hover:bg-orange-600"
          >
            <Plus className="h-4 w-4 mr-2" />
            Cadastrar Novo Animal
          </Button>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="disponiveis" className="space-y-4">
          <TabsList>
            <TabsTrigger value="disponiveis">
              Pets Disponíveis ({petsDisponiveis.length})
            </TabsTrigger>
            <TabsTrigger value="adotados">
              Pets Adotados ({petsAdotados.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="disponiveis">
            <Card>
              <CardHeader>
                <CardTitle>Pets Disponíveis para Adoção</CardTitle>
                <CardDescription>
                  Lista de todos os pets que estão aguardando adoção
                </CardDescription>
              </CardHeader>
              <CardContent>
                {petsDisponiveis.length === 0 ? (
                  <p className="text-gray-500">
                    Nenhum pet disponível no momento.
                  </p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nome</TableHead>
                        <TableHead>Raça</TableHead>
                        <TableHead>Idade</TableHead>
                        <TableHead>Sexo</TableHead>
                        <TableHead>Tamanho</TableHead>
                        <TableHead>Cidade</TableHead>
                        <TableHead>Cadastrado em</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {petsDisponiveis.map((pet) => (
                        <TableRow key={pet.id}>
                          <TableCell className="font-medium">
                            {pet.nome}
                          </TableCell>
                          <TableCell>{pet.raca}</TableCell>
                          <TableCell>
                            {pet.idade} {pet.idade === 1 ? "ano" : "anos"}
                          </TableCell>
                          <TableCell>{pet.sexo}</TableCell>
                          <TableCell>{pet.tamanho}</TableCell>
                          <TableCell>{pet.cidade}</TableCell>
                          <TableCell>{formatDate(pet.criadoem)}</TableCell>
                          <TableCell>
                            <Badge
                              variant="secondary"
                              className="bg-green-100 text-green-800"
                            >
                              Disponível
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEditAnimal(pet)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDeleteAnimal(pet)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="adotados">
            <Card>
              <CardHeader>
                <CardTitle>Pets Adotados</CardTitle>
                <CardDescription>
                  Lista de todos os pets que já foram adotados
                </CardDescription>
              </CardHeader>
              <CardContent>
                {petsAdotados.length === 0 ? (
                  <p className="text-gray-500">Nenhum pet foi adotado ainda.</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nome</TableHead>
                        <TableHead>Raça</TableHead>
                        <TableHead>Idade</TableHead>
                        <TableHead>Sexo</TableHead>
                        <TableHead>Tamanho</TableHead>
                        <TableHead>Cidade</TableHead>
                        <TableHead>Adotado em</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {petsAdotados.map((pet) => (
                        <TableRow key={pet.id}>
                          <TableCell className="font-medium">
                            {pet.nome}
                          </TableCell>
                          <TableCell>{pet.raca}</TableCell>
                          <TableCell>
                            {pet.idade} {pet.idade === 1 ? "ano" : "anos"}
                          </TableCell>
                          <TableCell>{pet.sexo}</TableCell>
                          <TableCell>{pet.tamanho}</TableCell>
                          <TableCell>{pet.cidade}</TableCell>
                          <TableCell>{formatDate(pet.atualizadoem)}</TableCell>
                          <TableCell>
                            <Badge className="bg-orange-100 text-orange-800">
                              Adotado
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEditAnimal(pet)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDeleteAnimal(pet)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Dialog de Confirmação de Exclusão */}
      <DeleteAnimalDialog
        animal={animalToDelete}
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onSuccess={handleDeleteSuccess}
      />
    </div>
  );
}
