import { useState } from "react";
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
  Eye,
  FileText,
  AlertTriangle,
  CheckCircle,
  Building2,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

interface Cliente {
  id: string;
  nome: string;
  email: string;
  cnpj: string;
  telefone: string;
  endereco: string;
  status: 'ativo' | 'inativo';
  pagamento: 'em_dia' | 'atrasado';
  ultimaInteracao: string;
  valorMensal: number;
}

const clientesData: Cliente[] = [
  {
    id: "1",
    nome: "Empresa ABC Ltda",
    email: "contato@abc.com.br",
    cnpj: "12.345.678/0001-90",
    telefone: "(11) 9876-5432",
    endereco: "Rua das Flores, 123 - São Paulo/SP",
    status: "ativo",
    pagamento: "em_dia",
    ultimaInteracao: "2025-01-15",
    valorMensal: 1500
  },
  {
    id: "2",
    nome: "Comércio XYZ S/A",
    email: "admin@xyz.com.br",
    cnpj: "98.765.432/0001-10",
    telefone: "(11) 1234-5678",
    endereco: "Av. Principal, 456 - São Paulo/SP",
    status: "ativo",
    pagamento: "atrasado",
    ultimaInteracao: "2025-01-10",
    valorMensal: 2200
  },
  {
    id: "3",
    nome: "Serviços DEF ME",
    email: "financeiro@def.com.br",
    cnpj: "11.222.333/0001-44",
    telefone: "(11) 5555-9999",
    endereco: "Rua Comercial, 789 - São Paulo/SP",
    status: "inativo",
    pagamento: "em_dia",
    ultimaInteracao: "2024-12-20",
    valorMensal: 800
  },
];

export default function Clientes() {
  const { userRole } = useAuth();
  const { toast } = useToast();
  
  const userType = userRole || 'cliente';

  const [clientes, setClientes] = useState<Cliente[]>(clientesData);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("todos");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCliente, setEditingCliente] = useState<Cliente | null>(null);

  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    cnpj: "",
    telefone: "",
    endereco: "",
    status: "ativo" as "ativo" | "inativo",
    valorMensal: 0
  });

  const filteredClientes = clientes.filter(cliente => {
    const matchesSearch = cliente.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cliente.cnpj.includes(searchTerm) ||
                         cliente.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === "todos" || cliente.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingCliente) {
      setClientes(clientes.map(cliente => 
        cliente.id === editingCliente.id 
          ? { ...cliente, ...formData, pagamento: 'em_dia', ultimaInteracao: new Date().toISOString().split('T')[0] }
          : cliente
      ));
      toast({ title: "Cliente atualizado com sucesso!" });
    } else {
      const novoCliente: Cliente = {
        id: (clientes.length + 1).toString(),
        ...formData,
        pagamento: 'em_dia',
        ultimaInteracao: new Date().toISOString().split('T')[0]
      };
      setClientes([...clientes, novoCliente]);
      toast({ title: "Cliente cadastrado com sucesso!" });
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({
      nome: "",
      email: "",
      cnpj: "",
      telefone: "",
      endereco: "",
      status: "ativo",
      valorMensal: 0
    });
    setEditingCliente(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (cliente: Cliente) => {
    setEditingCliente(cliente);
    setFormData({
      nome: cliente.nome,
      email: cliente.email,
      cnpj: cliente.cnpj,
      telefone: cliente.telefone,
      endereco: cliente.endereco,
      status: cliente.status,
      valorMensal: cliente.valorMensal
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setClientes(clientes.filter(cliente => cliente.id !== id));
    toast({ 
      title: "Cliente removido",
      description: "O cliente foi removido do sistema.",
      variant: "destructive"
    });
  };

  const getStatusBadge = (status: string) => {
    return status === 'ativo' 
      ? <Badge variant="default" className="bg-green-100 text-green-800">Ativo</Badge>
      : <Badge variant="secondary" className="bg-gray-100 text-gray-800">Inativo</Badge>;
  };

  const getPagamentoBadge = (pagamento: string) => {
    return pagamento === 'em_dia'
      ? <Badge variant="default" className="bg-blue-100 text-blue-800">Em Dia</Badge>
      : <Badge variant="destructive">Atrasado</Badge>;
  };

  const totalAtivos = clientes.filter(c => c.status === 'ativo').length;
  const totalAtrasados = clientes.filter(c => c.pagamento === 'atrasado').length;
  const receitaTotal = clientes.filter(c => c.status === 'ativo').reduce((acc, c) => acc + c.valorMensal, 0);

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Gestão de Clientes</h1>
            <p className="text-muted-foreground">
              Gerencie todos os clientes do escritório contábil
            </p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gradient-primary">
                <Plus className="mr-2 h-4 w-4" />
                Novo Cliente
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>
                  {editingCliente ? 'Editar Cliente' : 'Novo Cliente'}
                </DialogTitle>
                <DialogDescription>
                  {editingCliente 
                    ? 'Atualize as informações do cliente'
                    : 'Preencha os dados para cadastrar um novo cliente'
                  }
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="nome">Nome/Razão Social *</Label>
                    <Input
                      id="nome"
                      value={formData.nome}
                      onChange={(e) => setFormData({...formData, nome: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="cnpj">CNPJ *</Label>
                    <Input
                      id="cnpj"
                      value={formData.cnpj}
                      onChange={(e) => setFormData({...formData, cnpj: e.target.value})}
                      placeholder="00.000.000/0000-00"
                      required
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="telefone">Telefone *</Label>
                    <Input
                      id="telefone"
                      value={formData.telefone}
                      onChange={(e) => setFormData({...formData, telefone: e.target.value})}
                      placeholder="(11) 99999-9999"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endereco">Endereço</Label>
                  <Textarea
                    id="endereco"
                    value={formData.endereco}
                    onChange={(e) => setFormData({...formData, endereco: e.target.value})}
                    rows={2}
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select value={formData.status} onValueChange={(value: "ativo" | "inativo") => setFormData({...formData, status: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ativo">Ativo</SelectItem>
                        <SelectItem value="inativo">Inativo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="valorMensal">Valor Mensal (R$)</Label>
                    <Input
                      id="valorMensal"
                      type="number"
                      value={formData.valorMensal}
                      onChange={(e) => setFormData({...formData, valorMensal: parseFloat(e.target.value) || 0})}
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancelar
                  </Button>
                  <Button type="submit" className="gradient-primary">
                    {editingCliente ? 'Atualizar' : 'Cadastrar'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Clientes</CardTitle>
              <Building2 className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{clientes.length}</div>
              <p className="text-xs text-muted-foreground">
                {totalAtivos} ativos
              </p>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Clientes Ativos</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{totalAtivos}</div>
              <p className="text-xs text-muted-foreground">
                {((totalAtivos / clientes.length) * 100).toFixed(1)}% do total
              </p>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pagamentos Atrasados</CardTitle>
              <AlertTriangle className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">{totalAtrasados}</div>
              <p className="text-xs text-muted-foreground">
                Requer atenção
              </p>
            </CardContent>
          </Card>

          {userType === 'admin' && (
            <Card className="glass-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Receita Mensal</CardTitle>
                <FileText className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  R$ {receitaTotal.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">
                  Valor total dos contratos
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Filters */}
        <Card className="glass-card">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nome, CNPJ ou email..."
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
                    <TableHead>CNPJ</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Pagamento</TableHead>
                    {userType === 'admin' && <TableHead>Valor</TableHead>}
                    <TableHead>Última Interação</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredClientes.map((cliente) => (
                    <TableRow key={cliente.id} className="hover:bg-secondary/50">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                            <Building2 className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <div className="font-medium">{cliente.nome}</div>
                            <div className="text-sm text-muted-foreground flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {cliente.endereco.split(' - ')[1] || 'Não informado'}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-1 text-sm">
                            <Mail className="h-3 w-3" />
                            {cliente.email}
                          </div>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Phone className="h-3 w-3" />
                            {cliente.telefone}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-sm">{cliente.cnpj}</TableCell>
                      <TableCell>{getStatusBadge(cliente.status)}</TableCell>
                      <TableCell>{getPagamentoBadge(cliente.pagamento)}</TableCell>
                      {userType === 'admin' && (
                        <TableCell className="font-semibold text-green-600">
                          R$ {cliente.valorMensal.toLocaleString()}
                        </TableCell>
                      )}
                      <TableCell className="text-sm">
                        {new Date(cliente.ultimaInteracao).toLocaleDateString('pt-BR')}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => {/* Ver detalhes */}}>
                              <Eye className="mr-2 h-4 w-4" />
                              Ver Detalhes
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEdit(cliente)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => {/* Ver documentos */}}>
                              <FileText className="mr-2 h-4 w-4" />
                              Documentos
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => handleDelete(cliente.id)}
                              className="text-destructive"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Excluir
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