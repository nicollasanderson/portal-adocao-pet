// Configuração centralizada da API
const API_BASE_URL = "https://api-cadastro-pets-production-adaa.up.railway.app";

// Endpoints da API
export const API_ENDPOINTS = {
  // Usuários
  USUARIO_CADASTRO: `${API_BASE_URL}/api/v1/usuario`,
  USUARIO_LOGIN: `${API_BASE_URL}/api/v1/usuario/login`,
  USUARIO_ME: `${API_BASE_URL}/api/v1/usuario/me`,

  // Animais
  ANIMAIS: `${API_BASE_URL}/api/v1/animais`,
  ANIMAL_BY_ID: (id: string) => `${API_BASE_URL}/api/v1/animais/${id}`,
} as const;

// Tipos para as requisições
export interface CadastroUsuarioData {
  nome: string;
  email: string;
  telefone: string;
  numero: string;
  rua: string;
  bairro: string;
  cidade: string;
  cep: string;
  idade: string;
  profissao: string;
  experiencia_animais: string;
  preferencia_animal: string;
  tamanho_animal: string;
  raca_animal: string;
  senha: string;
}

export interface LoginData {
  email: string;
  senha: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface Usuario {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  numero: string;
  rua: string;
  bairro: string;
  cidade: string;
  cep: string;
  idade: string;
  profissao: string;
  experiencia_animais: string;
  preferencia_animal: string;
  tamanho_animal: string;
  raca_animal: string;
  role: "Usuario" | "Admin";
  criado_em: string;
  atualizado_em: string;
}

export interface Pet {
  id: string;
  nome: string;
  raca: string;
  idade: number;
  sexo: string;
  tamanho: string;
  peso: number;
  cor: string;
  temperamento: string;
  telefone: string;
  email: string;
  rua: string;
  bairro: string;
  cidade: string;
  cep: string;
  adotado: boolean;
  adotante_id: string;
  criadoem: string;
  atualizadoem: string;
}

export interface CriarAnimalData {
  nome: string;
  raca: string;
  idade: number;
  sexo: string;
  tamanho: string;
  peso: number;
  cor: string;
  temperamento: string;
  telefone: string;
  email: string;
  rua: string;
  bairro: string;
  cidade: string;
  cep: string;
}

export interface AtualizarAnimalData {
  // Campos que NÃO podem ser atualizados: nome, raca, sexo, cor
  idade?: number;
  tamanho?: string;
  peso?: number;
  temperamento?: string;
  telefone?: string;
  email?: string;
  rua?: string;
  bairro?: string;
  cidade?: string;
  cep?: string;
  adotado?: boolean;
}

// Funções utilitárias para chamadas da API
export class ApiService {
  // Cadastro de usuário
  static async cadastrarUsuario(data: CadastroUsuarioData): Promise<any> {
    const response = await fetch(API_ENDPOINTS.USUARIO_CADASTRO, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Erro ao realizar cadastro");
    }

    return response.json();
  }

  // Login de usuário
  static async loginUsuario(data: LoginData): Promise<LoginResponse> {
    const response = await fetch(API_ENDPOINTS.USUARIO_LOGIN, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Email ou senha incorretos");
    }

    return response.json();
  }

  // Buscar dados do usuário logado
  static async buscarUsuarioLogado(): Promise<Usuario> {
    const response = await this.fetchWithAuth(API_ENDPOINTS.USUARIO_ME);

    if (!response.ok) {
      if (response.status === 401) {
        // Token expirado ou inválido
        AuthService.clearTokens();
        throw new Error("Sessão expirada. Faça login novamente.");
      }
      throw new Error("Erro ao buscar dados do usuário");
    }

    return response.json();
  }

  // Buscar todos os animais
  static async buscarAnimais(): Promise<Pet[]> {
    const response = await fetch(API_ENDPOINTS.ANIMAIS);

    if (!response.ok) {
      throw new Error("Erro ao buscar pets");
    }

    return response.json();
  }

  // Buscar animais disponíveis (não adotados)
  static async buscarAnimaisDisponiveis(): Promise<Pet[]> {
    const animais = await this.buscarAnimais();
    return animais.filter((pet) => !pet.adotado);
  }

  // Buscar animais adotados
  static async buscarAnimaisAdotados(): Promise<Pet[]> {
    const animais = await this.buscarAnimais();
    return animais.filter((pet) => pet.adotado);
  }

  // Criar novo animal (apenas admin)
  static async criarAnimal(data: CriarAnimalData): Promise<Pet> {
    const response = await this.fetchWithAuth(API_ENDPOINTS.ANIMAIS, {
      method: "POST",
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Erro ao criar animal");
    }

    return response.json();
  }

  // Atualizar animal existente (apenas admin)
  static async atualizarAnimal(
    id: string,
    data: AtualizarAnimalData
  ): Promise<Pet> {
    const response = await this.fetchWithAuth(API_ENDPOINTS.ANIMAL_BY_ID(id), {
      method: "PATCH",
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Erro ao atualizar animal");
    }

    return response.json();
  }

  // Deletar animal (apenas admin)
  static async deletarAnimal(id: string): Promise<void> {
    const response = await this.fetchWithAuth(API_ENDPOINTS.ANIMAL_BY_ID(id), {
      method: "DELETE",
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Erro ao deletar animal");
    }
  }

  // Função para fazer requisições autenticadas
  static async fetchWithAuth(
    url: string,
    options: RequestInit = {}
  ): Promise<Response> {
    const token = AuthService.getAccessToken();

    if (!token) {
      throw new Error("Token de acesso não encontrado");
    }

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers,
    };

    return fetch(url, {
      ...options,
      headers,
    });
  }
}

// Utilitários para gerenciar tokens
export class AuthService {
  static saveTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
  }

  static getAccessToken(): string | null {
    return localStorage.getItem("accessToken");
  }

  static getRefreshToken(): string | null {
    return localStorage.getItem("refreshToken");
  }

  static clearTokens(): void {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  }

  static isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }

  // Verificar se o usuário é admin
  static async isAdmin(): Promise<boolean> {
    try {
      const usuario = await ApiService.buscarUsuarioLogado();
      return usuario.role === "Admin";
    } catch (error) {
      return false;
    }
  }

  // Verificar se o usuário tem permissão de admin (com cache)
  static async checkAdminPermission(): Promise<Usuario | null> {
    try {
      const usuario = await ApiService.buscarUsuarioLogado();
      return usuario.role === "Admin" ? usuario : null;
    } catch (error) {
      return null;
    }
  }
}
