"use client";

import type React from "react";

import { useState } from "react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Heart, ArrowLeft } from "lucide-react";
import { ApiService, type CadastroUsuarioData } from "@/lib/api";

export default function CadastroPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState<CadastroUsuarioData>({
    nome: "",
    email: "",
    telefone: "",
    numero: "",
    rua: "",
    bairro: "",
    cidade: "",
    cep: "",
    idade: "",
    profissao: "",
    experiencia_animais: "",
    preferencia_animal: "",
    tamanho_animal: "",
    raca_animal: "",
    senha: "",
  });

  const handleInputChange = (
    field: keyof CadastroUsuarioData,
    value: string
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await ApiService.cadastrarUsuario(formData);
      router.push("/login?message=Cadastro realizado com sucesso!");
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Erro ao realizar cadastro"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white py-12">
      <div className="max-w-2xl mx-auto px-4">
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center text-orange-600 hover:text-orange-700"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar ao início
          </Link>
        </div>

        <Card>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Heart className="h-12 w-12 text-orange-500" />
            </div>
            <CardTitle className="text-2xl">Cadastro para Adoção</CardTitle>
            <CardDescription>
              Preencha seus dados para se cadastrar e poder adotar um pet
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Dados Pessoais */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Dados Pessoais
                </h3>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="nome">Nome Completo *</Label>
                    <Input
                      id="nome"
                      value={formData.nome}
                      onChange={(e) =>
                        handleInputChange("nome", e.target.value)
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="telefone">Telefone *</Label>
                    <Input
                      id="telefone"
                      value={formData.telefone}
                      onChange={(e) =>
                        handleInputChange("telefone", e.target.value)
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="idade">Idade *</Label>
                    <Input
                      id="idade"
                      value={formData.idade}
                      onChange={(e) =>
                        handleInputChange("idade", e.target.value)
                      }
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="profissao">Profissão *</Label>
                  <Input
                    id="profissao"
                    value={formData.profissao}
                    onChange={(e) =>
                      handleInputChange("profissao", e.target.value)
                    }
                    required
                  />
                </div>
              </div>

              {/* Endereço */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Endereço
                </h3>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="cep">CEP *</Label>
                    <Input
                      id="cep"
                      value={formData.cep}
                      onChange={(e) => handleInputChange("cep", e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="cidade">Cidade *</Label>
                    <Input
                      id="cidade"
                      value={formData.cidade}
                      onChange={(e) =>
                        handleInputChange("cidade", e.target.value)
                      }
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="rua">Rua *</Label>
                    <Input
                      id="rua"
                      value={formData.rua}
                      onChange={(e) => handleInputChange("rua", e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="numero">Número *</Label>
                    <Input
                      id="numero"
                      value={formData.numero}
                      onChange={(e) =>
                        handleInputChange("numero", e.target.value)
                      }
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="bairro">Bairro *</Label>
                  <Input
                    id="bairro"
                    value={formData.bairro}
                    onChange={(e) =>
                      handleInputChange("bairro", e.target.value)
                    }
                    required
                  />
                </div>
              </div>

              {/* Preferências de Adoção */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Preferências de Adoção
                </h3>

                <div>
                  <Label htmlFor="experiencia_animais">
                    Experiência com Animais *
                  </Label>
                  <Textarea
                    id="experiencia_animais"
                    value={formData.experiencia_animais}
                    onChange={(e) =>
                      handleInputChange("experiencia_animais", e.target.value)
                    }
                    placeholder="Descreva sua experiência com animais de estimação"
                    required
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="preferencia_animal">
                      Preferência de Animal *
                    </Label>
                    <Select
                      onValueChange={(value) =>
                        handleInputChange("preferencia_animal", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cachorro">Cachorro</SelectItem>
                        <SelectItem value="gato">Gato</SelectItem>
                        <SelectItem value="ambos">Ambos</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="tamanho_animal">Tamanho Preferido *</Label>
                    <Select
                      onValueChange={(value) =>
                        handleInputChange("tamanho_animal", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pequeno">Pequeno</SelectItem>
                        <SelectItem value="medio">Médio</SelectItem>
                        <SelectItem value="grande">Grande</SelectItem>
                        <SelectItem value="qualquer">Qualquer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="raca_animal">Raça Preferida</Label>
                  <Input
                    id="raca_animal"
                    value={formData.raca_animal}
                    onChange={(e) =>
                      handleInputChange("raca_animal", e.target.value)
                    }
                    placeholder="Deixe em branco se não tiver preferência"
                  />
                </div>
              </div>

              {/* Senha */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Acesso</h3>
                <div>
                  <Label htmlFor="senha">Senha *</Label>
                  <Input
                    id="senha"
                    type="password"
                    value={formData.senha}
                    onChange={(e) => handleInputChange("senha", e.target.value)}
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-orange-500 hover:bg-orange-600"
                disabled={loading}
              >
                {loading ? "Cadastrando..." : "Finalizar Cadastro"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Já tem uma conta?{" "}
                <Link
                  href="/login"
                  className="text-orange-600 hover:text-orange-700 font-medium"
                >
                  Faça login
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
