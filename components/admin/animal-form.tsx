"use client";

import type React from "react";

import { useState } from "react";
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
import { Checkbox } from "@/components/ui/checkbox";
import { X } from "lucide-react";
import {
  ApiService,
  type Pet,
  type CriarAnimalData,
  type AtualizarAnimalData,
} from "@/lib/api";

interface AnimalFormProps {
  animal?: Pet | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export function AnimalForm({ animal, onSuccess, onCancel }: AnimalFormProps) {
  const isEditing = !!animal;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    nome: animal?.nome || "",
    raca: animal?.raca || "",
    idade: animal?.idade || 1,
    sexo: animal?.sexo || "",
    tamanho: animal?.tamanho || "",
    peso: animal?.peso || 1,
    cor: animal?.cor || "",
    temperamento: animal?.temperamento || "",
    telefone: animal?.telefone || "",
    email: animal?.email || "",
    rua: animal?.rua || "",
    bairro: animal?.bairro || "",
    cidade: animal?.cidade || "",
    cep: animal?.cep || "",
    adotado: animal?.adotado || false,
  });

  const handleInputChange = (
    field: string,
    value: string | number | boolean
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (isEditing && animal) {
        // Atualizar animal - apenas campos editáveis
        const updateData: AtualizarAnimalData = {
          idade: formData.idade,
          tamanho: formData.tamanho,
          peso: formData.peso,
          temperamento: formData.temperamento,
          telefone: formData.telefone,
          email: formData.email,
          rua: formData.rua,
          bairro: formData.bairro,
          cidade: formData.cidade,
          cep: formData.cep,
          adotado: formData.adotado,
        };
        await ApiService.atualizarAnimal(animal.id, updateData);
      } else {
        // Criar novo animal
        const createData: CriarAnimalData = {
          nome: formData.nome,
          raca: formData.raca,
          idade: formData.idade,
          sexo: formData.sexo,
          tamanho: formData.tamanho,
          peso: formData.peso,
          cor: formData.cor,
          temperamento: formData.temperamento,
          telefone: formData.telefone,
          email: formData.email,
          rua: formData.rua,
          bairro: formData.bairro,
          cidade: formData.cidade,
          cep: formData.cep,
        };
        await ApiService.criarAnimal(createData);
      }

      onSuccess();
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Erro ao salvar animal"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>
              {isEditing ? "Editar Animal" : "Cadastrar Novo Animal"}
            </CardTitle>
            <CardDescription>
              {isEditing
                ? "Atualize as informações do animal (nome, raça, sexo e cor não podem ser alterados)"
                : "Preencha as informações do animal para cadastro"}
            </CardDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={onCancel}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informações Básicas */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Informações Básicas
            </h3>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="nome">Nome *</Label>
                <Input
                  id="nome"
                  value={formData.nome}
                  onChange={(e) => handleInputChange("nome", e.target.value)}
                  disabled={isEditing}
                  required
                />
                {isEditing && (
                  <p className="text-xs text-gray-500 mt-1">
                    Nome não pode ser alterado
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="raca">Raça *</Label>
                <Input
                  id="raca"
                  value={formData.raca}
                  onChange={(e) => handleInputChange("raca", e.target.value)}
                  disabled={isEditing}
                  required
                />
                {isEditing && (
                  <p className="text-xs text-gray-500 mt-1">
                    Raça não pode ser alterada
                  </p>
                )}
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="idade">Idade (anos) *</Label>
                <Input
                  id="idade"
                  type="number"
                  min="0"
                  max="30"
                  value={formData.idade}
                  onChange={(e) =>
                    handleInputChange(
                      "idade",
                      Number.parseInt(e.target.value) || 1
                    )
                  }
                  required
                />
              </div>
              <div>
                <Label htmlFor="sexo">Sexo *</Label>
                <Select
                  value={formData.sexo}
                  onValueChange={(value) => handleInputChange("sexo", value)}
                  disabled={isEditing}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Macho">Macho</SelectItem>
                    <SelectItem value="Fêmea">Fêmea</SelectItem>
                  </SelectContent>
                </Select>
                {isEditing && (
                  <p className="text-xs text-gray-500 mt-1">
                    Sexo não pode ser alterado
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="peso">Peso (kg) *</Label>
                <Input
                  id="peso"
                  type="number"
                  min="0.1"
                  step="0.1"
                  value={formData.peso}
                  onChange={(e) =>
                    handleInputChange(
                      "peso",
                      Number.parseFloat(e.target.value) || 1
                    )
                  }
                  required
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="tamanho">Tamanho *</Label>
                <Select
                  value={formData.tamanho}
                  onValueChange={(value) => handleInputChange("tamanho", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pequeno">Pequeno</SelectItem>
                    <SelectItem value="Médio">Médio</SelectItem>
                    <SelectItem value="Grande">Grande</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="cor">Cor *</Label>
                <Input
                  id="cor"
                  value={formData.cor}
                  onChange={(e) => handleInputChange("cor", e.target.value)}
                  disabled={isEditing}
                  required
                />
                {isEditing && (
                  <p className="text-xs text-gray-500 mt-1">
                    Cor não pode ser alterada
                  </p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="temperamento">Temperamento *</Label>
              <Textarea
                id="temperamento"
                value={formData.temperamento}
                onChange={(e) =>
                  handleInputChange("temperamento", e.target.value)
                }
                placeholder="Descreva o temperamento do animal"
                required
              />
            </div>
          </div>

          {/* Contato */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Contato</h3>

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
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          {/* Endereço */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Localização</h3>

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
                  onChange={(e) => handleInputChange("cidade", e.target.value)}
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
                <Label htmlFor="bairro">Bairro *</Label>
                <Input
                  id="bairro"
                  value={formData.bairro}
                  onChange={(e) => handleInputChange("bairro", e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          {/* Status de Adoção (apenas na edição) */}
          {isEditing && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Status</h3>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="adotado"
                  checked={formData.adotado}
                  onCheckedChange={(checked) =>
                    handleInputChange("adotado", checked)
                  }
                />
                <Label htmlFor="adotado">Animal foi adotado</Label>
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-4 pt-6">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-orange-500 hover:bg-orange-600"
            >
              {loading
                ? "Salvando..."
                : isEditing
                ? "Atualizar Animal"
                : "Cadastrar Animal"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
