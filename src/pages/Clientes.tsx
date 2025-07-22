import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
  Building2,
  Mail,
  Phone,
  User,
  MapPin,
  FileText,
  Eye,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

interface Cliente {
  id: string;
  nome: string;
  email: string;
  telefone?: string;
  empresa?: string;
  cnpj?: string;
  endereco?: string;
  cep?: string;
  cidade?: string;
  estado?: string;
  complemento?: string;
  ativo: boolean;
  created_at: string;
  user_id: string;
}

const estadosBrasil = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
  'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
  'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
];

export default function Clientes() {
  const { userRole, isAdmin, isFuncionario } = useAuth();
  const { toast } = useToast();
  
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("todos");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCliente, setEditingCliente] = useState<Cliente | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    empresa: "",
    cnpj: "",
    endereco: "",
    cep: "",
    cidade: "",
    estado: "",
    complemento: "",
    senha: "",
    confirmarSenha: "",
    ativo: true
  });

  useEffect(() => {
    if (isAdmin || isFuncionario) {
      fetchClientes();
    }
  }, [isAdmin, isFuncionario]);

  const fetchClientes = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          id,
          nome,
          email,
          telefone,
          empresa,
          cnpj,
          endereco,
          cep,
          cidade,
          estado,
          complemento,
          ativo,
          created_at,
          user_id
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Filtrar apenas usuários com role 'cliente'
      if (data) {
        const { data: clientRoles, error: rolesError } = await supabase
          .from('user_roles')
          .select('user_id')
          .eq('role', 'cliente');

        if (rolesError) throw rolesError;

        const clientUserIds = clientRoles?.map(role => role.user_id) || [];
        const clientProfiles = data.filter(profile => 
          clientUserIds.includes(profile.user_id)
        );

        setClientes(clientProfiles);
      }
    } catch (error) {
      console.error('Error fetching clients:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar clientes",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredClientes = clientes.filter(cliente => {
    const matchesSearch = (
      cliente.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cliente.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (cliente.empresa && cliente.empresa.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (cliente.cnpj && cliente.cnpj.includes(searchTerm)) ||
      (cliente.cidade && cliente.cidade.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    
    const matchesFilter = filterStatus === "todos" || 
                         (filterStatus === "ativo" && cliente.ativo) ||
                         (filterStatus === "inativo" && !cliente.ativo);
    
    return matchesSearch && matchesFilter;
  });

  const formatCNPJ = (cnpj: string) => {
    return cnpj
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1/$2')
      .replace(/(\d{4})(\d)/, '$1-$2')
      .substring(0, 18);
  };

  const formatCEP = (cep: string) => {
    return cep
      .replace(/\D/g, '')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .substring(0, 9);
  };

  const formatPhone = (phone: string) => {
    return phone
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .substring(0, 15);
  };

  const validateCNPJ = (cnpj: string) => {
    const cleaned = cnpj.replace(/\D/g, '');
    return cleaned.length === 14;
  };

  const validateCEP = (cep: string) => {
    const cleaned = cep.replace(/\D/g, '');
    return cleaned.length === 8;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingCliente) {
      if (!formData.senha || formData.senha.length < 6) {
        toast({
          title: "Erro",
          description: "A senha deve ter pelo menos 6 caracteres",
          variant: "destructive",
        });
        return;
      }

      if (formData.senha !== formData.confirmarSenha) {
        toast({
          title: "Erro",
          description: "As senhas não coincidem",
          variant: "destructive",
        });
        return;
      }
    }

    if (formData.cnpj && !validateCNPJ(formData.cnpj)) {
      toast({
        title: "Erro",
        description: "CNPJ inválido",
        variant: "destructive",
      });
      return;
    }

    if (formData.cep && !validateCEP(formData.cep)) {
      toast({
        title: "Erro",
        description: "CEP inválido",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);

    try {
      if (editingCliente) {
        // Atualizar cliente existente
        const { error } = await supabase
          .from('profiles')
          .update({
            nome: formData.nome,
            telefone: formData.telefone || null,
            empresa: formData.empresa || null,
            cnpj: formData.cnpj ? formData.cnpj.replace(/\D/g, '') : null,
            endereco: formData.endereco || null,
            cep: formData.cep ? formData.cep.replace(/\D/g, '') : null,
            cidade: formData.cidade || null,
            estado: formData.estado || null,
            complemento: formData.complemento || null,
            ativo: formData.ativo
          })
          .eq('id', editingCliente.id);

        if (error) throw error;

        toast({ 
          title: "Sucesso",
          description: "Cliente atualizado com sucesso!" 
        });
      } else {
        // Criar novo usuário no auth
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.senha,
          options: {
            data: {
              nome: formData.nome,
              empresa: formData.empresa
            }
          }
        });

        if (authError) {
          if (authError.message.includes('User already registered')) {
            toast({
              title: "Erro",
              description: "Este email já está cadastrado no sistema",
              variant: "destructive",
            });
            return;
          }
          throw authError;
        }

        if (authData.user) {
          // Aguardar um pouco para o trigger criar o perfil
          await new Promise(resolve => setTimeout(resolve, 1500));

          // Atualizar o perfil criado pelo trigger
          const { error: profileError } = await supabase
            .from('profiles')
            .update({
              telefone: formData.telefone || null,
              empresa: formData.empresa || null,
              cnpj: formData.cnpj ? formData.cnpj.replace(/\D/g, '') : null,
              endereco: formData.endereco || null,
              cep: formData.cep ? formData.cep.replace(/\D/g, '') : null,
              cidade: formData.cidade || null,
              estado: formData.estado || null,
              complemento: formData.complemento || null,
              ativo: formData.ativo
            })
            .eq('user_id', authData.user.id);

          if (profileError) {
            console.error('Error updating profile:', profileError);
          }

          // Atribuir role de cliente
          const { error: roleError } = await supabase
            .from('user_roles')
            .insert({
              user_id: authData.user.id,
              role: 'cliente'
            });

          if (roleError) {
            console.error('Role error:', roleError);
            // Tentar novamente após um delay
            setTimeout(async () => {
              await supabase
                .from('user_roles')
                .insert({
                  user_id: authData.user.id,
                  role: 'cliente'
                });
            }, 2000);
          }

          toast({ 
            title: "Sucesso",
            description: "Cliente cadastrado com sucesso! Senha temporária criada." 
          });
        }
      }

      resetForm();
      await fetchClientes();
    } catch (error: any) {
      console.error('Error saving client:', error);
      toast({
        title: "Erro",
        description: error.message || "Erro ao salvar cliente",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      nome: "",
      email: "",
      telefone: "",
      empresa: "",
      cnpj: "",
      endereco: "",
      cep: "",
      cidade: "",
      estado: "",
      complemento: "",
      senha: "",
      confirmarSenha: "",
      ativo: true
    });
    setEditingCliente(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (cliente: Cliente) => {
    setEditingCliente(cliente);
    setFormData({
      nome: cliente.nome,
      email: cliente.email,
      telefone: cliente.telefone || "",
      empresa: cliente.empresa || "",
      cnpj: cliente.cnpj ? formatCNPJ(cliente.cnpj) : "",
      endereco: cliente.endereco || "",
      cep: cliente.cep ? formatCEP(cliente.cep) : "",
      cidade: cliente.cidade || "",
      estado: cliente.estado || "",
      complemento: cliente.complemento || "",
      senha: "",
      confirmarSenha: "",
      ativo: cliente.ativo
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (cliente: Cliente) => {
    if (!confirm(`Tem certeza que deseja desativar o cliente ${cliente.nome}?`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ ativo: false })
        .eq('id', cliente.id);

      if (error) throw error;

      toast({ 
        title: "Cliente desativado",
        description: "O cliente foi desativado do sistema.",
      });

      await fetchClientes();
    } catch (error) {
      console.error('Error deactivating client:', error);
      toast({
        title: "Erro",
        description: "Erro ao desativar cliente",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (ativo: boolean) => {
    return ativo 
      ? <Badge variant="default" className="bg-green-100 text-green-800 border-green-200">Ativo</Badge>
      : <Badge variant="secondary" className="bg-gray-100 text-gray-800 border-gray-200">Inativo</Badge>;
  };

  const totalAtivos = clientes.filter(c => c.ativo).length;
  const totalInativos = clientes.filter(c => !c.ativo).length;

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Carregando clientes...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!isAdmin && !isFuncionario) {
    return (
      <Layout>
        <div className="text-center py-12">
          <Building2 className="mx-auto h-12 w-12 text-muted-foreground/50" />
          <h3 className="mt-4 text-lg font-medium">Acesso Restrito</h3>
          <p className="text-muted-foreground">
            Apenas administradores e funcionários podem gerenciar clientes.
          </p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Gestão de Clientes</h1>
            <p className="text-muted-foreground">
              Cadastre e gerencie todos os clientes do escritório contábil
            </p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gradient-primary">
                <Plus className="mr-2 h-4 w-4" />
                Novo Cliente
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingCliente ? 'Editar Cliente' : 'Cadastrar Novo Cliente'}
                </DialogTitle>
                <DialogDescription>
                  {editingCliente 
                    ? 'Atualize as informações do cliente'
                    : 'Preencha os dados completos para cadastrar um novo cliente com acesso ao sistema'
                  }
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Dados Básicos */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium border-b pb-2">Dados Básicos</h3>
                  
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="nome">Nome Completo / Razão Social *</Label>
                      <Input
                        id="nome"
                        value={formData.nome}
                        onChange={(e) => setFormData({...formData, nome: e.target.value})}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        required
                        disabled={!!editingCliente}
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="telefone">Telefone</Label>
                      <Input
                        id="telefone"
                        value={formData.telefone}
                        onChange={(e) => setFormData({...formData, telefone: formatPhone(e.target.value)})}
                        placeholder="(11) 99999-9999"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="empresa">Nome Fantasia</Label>
                      <Input
                        id="empresa"
                        value={formData.empresa}
                        onChange={(e) => setFormData({...formData, empresa: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cnpj">CNPJ</Label>
                    <Input
                      id="cnpj"
                      value={formData.cnpj}
                      onChange={(e) => setFormData({...formData, cnpj: formatCNPJ(e.target.value)})}
                      placeholder="00.000.000/0000-00"
                    />
                  </div>
                </div>

                {/* Endereço */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium border-b pb-2">Endereço</h3>
                  
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                      <Label htmlFor="cep">CEP</Label>
                      <Input
                        id="cep"
                        value={formData.cep}
                        onChange={(e) => setFormData({...formData, cep: formatCEP(e.target.value)})}
                        placeholder="00000-000"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="cidade">Cidade</Label>
                      <Input
                        id="cidade"
                        value={formData.cidade}
                        onChange={(e) => setFormData({...formData, cidade: e.target.value})}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="estado">Estado</Label>
                      <Select 
                        value={formData.estado} 
                        onValueChange={(value) => setFormData({...formData, estado: value})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          {estadosBrasil.map(estado => (
                            <SelectItem key={estado} value={estado}>{estado}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="endereco">Logradouro</Label>
                    <Input
                      id="endereco"
                      value={formData.endereco}
                      onChange={(e) => setFormData({...formData, endereco: e.target.value})}
                      placeholder="Rua, Avenida, etc."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="complemento">Complemento</Label>
                    <Input
                      id="complemento"
                      value={formData.complemento}
                      onChange={(e) => setFormData({...formData, complemento: e.target.value})}
                      placeholder="Apartamento, sala, andar, etc."
                    />
                  </div>
                </div>

                {/* Acesso ao Sistema */}
                {!editingCliente && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium border-b pb-2">Acesso ao Sistema</h3>
                    
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="senha">Senha Temporária *</Label>
                        <Input
                          id="senha"
                          type="password"
                          value={formData.senha}
                          onChange={(e) => setFormData({...formData, senha: e.target.value})}
                          placeholder="Mínimo 6 caracteres"
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="confirmarSenha">Confirmar Senha *</Label>
                        <Input
                          id="confirmarSenha"
                          type="password"
                          value={formData.confirmarSenha}
                          onChange={(e) => setFormData({...formData, confirmarSenha: e.target.value})}
                          required
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Status */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium border-b pb-2">Status</h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="ativo">Status do Cliente</Label>
                    <Select 
                      value={formData.ativo ? "true" : "false"} 
                      onValueChange={(value) => setFormData({...formData, ativo: value === "true"})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="true">Ativo</SelectItem>
                        <SelectItem value="false">Inativo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex justify-end space-x-2 pt-4 border-t">
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancelar
                  </Button>
                  <Button type="submit" className="gradient-primary" disabled={submitting}>
                    {submitting ? "Salvando..." : editingCliente ? 'Atualizar' : 'Cadastrar'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Clientes</CardTitle>
              <Building2 className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{clientes.length}</div>
              <p className="text-xs text-muted-foreground">
                Cadastrados no sistema
              </p>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Clientes Ativos</CardTitle>
              <User className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{totalAtivos}</div>
              <p className="text-xs text-muted-foreground">
                {clientes.length > 0 ? ((totalAtivos / clientes.length) * 100).toFixed(1) : 0}% do total
              </p>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Clientes Inativos</CardTitle>
              <User className="h-4 w-4 text-gray-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-600">{totalInativos}</div>
              <p className="text-xs text-muted-foreground">
                Desativados
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="glass-card">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nome, email, empresa, CNPJ ou cidade..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os Status</SelectItem>
                  <SelectItem value="ativo">Apenas Ativos</SelectItem>
                  <SelectItem value="inativo">Apenas Inativos</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Tabela de Clientes */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Lista de Clientes</CardTitle>
            <CardDescription>
              {filteredClientes.length} de {clientes.length} clientes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Contato</TableHead>
                    <TableHead>Empresa/CNPJ</TableHead>
                    <TableHead>Localização</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Cadastrado</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredClientes.map((cliente) => (
                    <TableRow key={cliente.id} className="hover:bg-secondary/50">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                            <User className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <div className="font-medium">{cliente.nome}</div>
                            {cliente.empresa && cliente.empresa !== cliente.nome && (
                              <div className="text-sm text-muted-foreground">{cliente.empresa}</div>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-1 text-sm">
                            <Mail className="h-3 w-3" />
                            {cliente.email}
                          </div>
                          {cliente.telefone && (
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Phone className="h-3 w-3" />
                              {formatPhone(cliente.telefone)}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {cliente.empresa && (
                            <div className="text-sm font-medium">{cliente.empresa}</div>
                          )}
                          {cliente.cnpj && (
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <FileText className="h-3 w-3" />
                              {formatCNPJ(cliente.cnpj)}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {cliente.cidade && cliente.estado ? (
                          <div className="flex items-center gap-1 text-sm">
                            <MapPin className="h-3 w-3" />
                            {cliente.cidade}, {cliente.estado}
                          </div>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>{getStatusBadge(cliente.ativo)}</TableCell>
                      <TableCell className="text-sm">
                        {new Date(cliente.created_at).toLocaleDateString('pt-BR')}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEdit(cliente)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => handleDelete(cliente)}
                              className="text-destructive"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Desativar
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            
            {filteredClientes.length === 0 && (
              <div className="text-center py-12">
                <Building2 className="mx-auto h-12 w-12 text-muted-foreground/50" />
                <h3 className="mt-4 text-lg font-medium">Nenhum cliente encontrado</h3>
                <p className="text-muted-foreground">
                  {searchTerm || filterStatus !== 'todos' 
                    ? 'Tente ajustar os filtros de busca'
                    : 'Comece cadastrando o primeiro cliente'
                  }
                </p>
                {!searchTerm && filterStatus === 'todos' && (
                  <Button 
                    className="mt-4 gradient-primary"
                    onClick={() => setIsDialogOpen(true)}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Cadastrar Primeiro Cliente
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}