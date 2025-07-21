import { Layout } from "@/components/Layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Users,
  FileText,
  CheckSquare,
  AlertTriangle,
  TrendingUp,
  DollarSign,
  Calendar,
  Clock,
  Building2,
  Target,
  Activity,
  Zap,
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";

const documentosData = [
  { name: "Pessoal", value: 45, color: "hsl(var(--dept-pessoal))" },
  { name: "Contábil", value: 32, color: "hsl(var(--dept-contabil))" },
  { name: "Fiscal", value: 28, color: "hsl(var(--dept-fiscal))" },
  { name: "Legal", value: 15, color: "hsl(var(--dept-legal))" },
];

const atividadesMes = [
  { mes: "Jan", documentos: 120, tarefas: 85 },
  { mes: "Fev", documentos: 140, tarefas: 92 },
  { mes: "Mar", documentos: 180, tarefas: 105 },
  { mes: "Abr", documentos: 160, tarefas: 98 },
  { mes: "Mai", documentos: 220, tarefas: 115 },
  { mes: "Jun", documentos: 200, tarefas: 108 },
];

const receitaMes = [
  { mes: "Jan", receita: 45000 },
  { mes: "Fev", receita: 52000 },
  { mes: "Mar", receita: 48000 },
  { mes: "Abr", receita: 61000 },
  { mes: "Mai", receita: 55000 },
  { mes: "Jun", receita: 67000 },
];

export default function Dashboard() {
  const userType = localStorage.getItem("userType") as 'admin' | 'funcionario' | 'cliente' || 'admin';
  const userName = localStorage.getItem("userName") || 'Usuário';

  const renderAdminStats = () => (
    <>
      <Card className="glass-card hover-lift">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Receita Mensal</CardTitle>
          <DollarSign className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">R$ 67.000</div>
          <p className="text-xs text-muted-foreground">
            +12% em relação ao mês anterior
          </p>
        </CardContent>
      </Card>

      <Card className="glass-card hover-lift">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Valores em Atraso</CardTitle>
          <AlertTriangle className="h-4 w-4 text-destructive" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-destructive">R$ 8.500</div>
          <p className="text-xs text-muted-foreground">
            3 clientes com pendências
          </p>
        </CardContent>
      </Card>
    </>
  );

  const renderClienteStats = () => (
    <>
      <Card className="glass-card hover-lift">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Meus Documentos</CardTitle>
          <FileText className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">8</div>
          <p className="text-xs text-muted-foreground">
            3 novos este mês
          </p>
        </CardContent>
      </Card>

      <Card className="glass-card hover-lift">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Solicitações</CardTitle>
          <Clock className="h-4 w-4 text-yellow-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">2</div>
          <p className="text-xs text-muted-foreground">
            Em andamento
          </p>
        </CardContent>
      </Card>
    </>
  );

  return (
    <Layout userType={userType} userName={userName}>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">
            Bem-vindo, {userName.split(' ')[0]}! 👋
          </h1>
          <p className="text-muted-foreground">
            {userType === 'cliente' 
              ? 'Aqui está o resumo dos seus documentos e solicitações.'
              : 'Aqui está o resumo das atividades do escritório.'
            }
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="glass-card hover-lift">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {userType === 'cliente' ? 'Meu Status' : 'Clientes Ativos'}
              </CardTitle>
              <Users className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {userType === 'cliente' ? 'Em Dia' : '127'}
              </div>
              <p className="text-xs text-muted-foreground">
                {userType === 'cliente' ? 'Pagamentos em dia' : '+5 novos este mês'}
              </p>
            </CardContent>
          </Card>

          <Card className="glass-card hover-lift">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Documentos</CardTitle>
              <FileText className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {userType === 'cliente' ? '8' : '1.247'}
              </div>
              <p className="text-xs text-muted-foreground">
                {userType === 'cliente' ? 'Total de documentos' : '+15% este mês'}
              </p>
            </CardContent>
          </Card>

          {userType === 'admin' ? renderAdminStats() : 
           userType === 'cliente' ? renderClienteStats() : 
           <>
             <Card className="glass-card hover-lift">
               <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                 <CardTitle className="text-sm font-medium">Minhas Tarefas</CardTitle>
                 <CheckSquare className="h-4 w-4 text-green-600" />
               </CardHeader>
               <CardContent>
                 <div className="text-2xl font-bold">23</div>
                 <p className="text-xs text-muted-foreground">
                   8 concluídas hoje
                 </p>
               </CardContent>
             </Card>

             <Card className="glass-card hover-lift">
               <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                 <CardTitle className="text-sm font-medium">Produtividade</CardTitle>
                 <TrendingUp className="h-4 w-4 text-primary" />
               </CardHeader>
               <CardContent>
                 <div className="text-2xl font-bold">92%</div>
                 <p className="text-xs text-muted-foreground">
                   Meta mensal
                 </p>
               </CardContent>
             </Card>
           </>
          }
        </div>

        {/* Charts Section */}
        {userType !== 'cliente' && (
          <div className="grid gap-6 md:grid-cols-2">
            {/* Documentos por Departamento */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Documentos por Departamento</CardTitle>
                <CardDescription>Distribuição mensal atual</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={documentosData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      dataKey="value"
                    >
                      {documentosData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex flex-wrap gap-2 justify-center mt-4">
                  {documentosData.map((item, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                      {item.name}: {item.value}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Atividades */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Atividades Mensais</CardTitle>
                <CardDescription>Documentos e tarefas processadas</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={atividadesMes}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="mes" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="documentos" fill="hsl(var(--primary))" />
                    <Bar dataKey="tarefas" fill="hsl(var(--secondary))" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Receita Chart - Apenas Admin */}
        {userType === 'admin' && (
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Evolução da Receita</CardTitle>
              <CardDescription>Receita mensal em R$</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={receitaMes}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mes" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`R$ ${value.toLocaleString()}`, 'Receita']} />
                  <Line 
                    type="monotone" 
                    dataKey="receita" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={3}
                    dot={{ fill: 'hsl(var(--primary))' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {/* Quick Actions */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Ações Rápidas</CardTitle>
            <CardDescription>
              {userType === 'cliente' 
                ? 'Acesse rapidamente suas funcionalidades'
                : 'Acesse rapidamente as funcionalidades mais utilizadas'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
              {userType === 'cliente' ? (
                <>
                  <Button variant="outline" className="h-20 flex-col gap-2">
                    <FileText className="h-6 w-6" />
                    Ver Documentos
                  </Button>
                  <Button variant="outline" className="h-20 flex-col gap-2">
                    <Clock className="h-6 w-6" />
                    Nova Solicitação
                  </Button>
                  <Button variant="outline" className="h-20 flex-col gap-2">
                    <Calendar className="h-6 w-6" />
                    Agendar Reunião
                  </Button>
                  <Button variant="outline" className="h-20 flex-col gap-2">
                    <Activity className="h-6 w-6" />
                    Meu Histórico
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outline" className="h-20 flex-col gap-2">
                    <Users className="h-6 w-6" />
                    Novo Cliente
                  </Button>
                  <Button variant="outline" className="h-20 flex-col gap-2">
                    <FileText className="h-6 w-6" />
                    Enviar Documento
                  </Button>
                  <Button variant="outline" className="h-20 flex-col gap-2">
                    <CheckSquare className="h-6 w-6" />
                    Nova Tarefa
                  </Button>
                  <Button variant="outline" className="h-20 flex-col gap-2">
                    <Calendar className="h-6 w-6" />
                    Agenda
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Progress Section - Não Cliente */}
        {userType !== 'cliente' && (
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Metas do Mês</CardTitle>
                <CardDescription>Progresso das metas estabelecidas</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Documentos Processados</span>
                    <span>85%</span>
                  </div>
                  <Progress value={85} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Tarefas Concluídas</span>
                    <span>92%</span>
                  </div>
                  <Progress value={92} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Satisfação Clientes</span>
                    <span>98%</span>
                  </div>
                  <Progress value={98} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Próximos Vencimentos</CardTitle>
                <CardDescription>Obrigações nos próximos 7 dias</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">DARF - Empresa ABC</p>
                    <p className="text-xs text-muted-foreground">Vence em 2 dias</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg border border-red-200">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">FGTS - Empresa XYZ</p>
                    <p className="text-xs text-muted-foreground">Vence amanhã</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <Calendar className="h-4 w-4 text-blue-600" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Reunião - Cliente DEF</p>
                    <p className="text-xs text-muted-foreground">Hoje às 14h</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </Layout>
  );
}