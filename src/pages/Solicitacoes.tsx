import { Layout } from "@/components/Layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Send, CheckCircle, AlertCircle, User } from "lucide-react";

export default function Solicitacoes() {
  const solicitacoes = [
    {
      id: 1,
      titulo: "Solicitação de Certidão Negativa",
      descricao: "Preciso de uma certidão negativa de débitos municipais",
      dataAbertura: "20/07/2025",
      status: "em_andamento",
      prioridade: "alta",
      responsavel: "João Silva",
      prazo: "25/07/2025",
      categoria: "Certidões"
    },
    {
      id: 2,
      titulo: "Declaração de Imposto de Renda",
      descricao: "Declaração de IR pessoa física ano 2024",
      dataAbertura: "18/07/2025",
      status: "concluida",
      prioridade: "media",
      responsavel: "Maria Santos",
      prazo: "22/07/2025",
      categoria: "Tributário"
    },
    {
      id: 3,
      titulo: "Alteração Contratual",
      descricao: "Necessário alterar objeto social da empresa",
      dataAbertura: "22/07/2025",
      status: "pendente",
      prioridade: "baixa",
      responsavel: "Não atribuído",
      prazo: "30/07/2025",
      categoria: "Jurídico"
    },
    {
      id: 4,
      titulo: "Balancete Mensal",
      descricao: "Elaboração do balancete do mês de junho/2025",
      dataAbertura: "19/07/2025",
      status: "em_andamento",
      prioridade: "alta",
      responsavel: "Pedro Costa",
      prazo: "24/07/2025",
      categoria: "Contabilidade"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "concluida": return "bg-green-100 text-green-800";
      case "em_andamento": return "bg-blue-100 text-blue-800";
      case "pendente": return "bg-yellow-100 text-yellow-800";
      case "cancelada": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getPrioridadeColor = (prioridade: string) => {
    switch (prioridade) {
      case "alta": return "bg-red-100 text-red-800";
      case "media": return "bg-yellow-100 text-yellow-800";
      case "baixa": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "concluida": return CheckCircle;
      case "em_andamento": return Clock;
      case "pendente": return AlertCircle;
      default: return Send;
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Solicitações</h1>
            <p className="text-muted-foreground">Acompanhe suas solicitações de serviços</p>
          </div>
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
            Nova Solicitação
          </Button>
        </div>

        {/* Resumo */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total</CardTitle>
              <Send className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{solicitacoes.length}</div>
              <p className="text-xs text-muted-foreground">solicitações</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Concluídas</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {solicitacoes.filter(s => s.status === "concluida").length}
              </div>
              <p className="text-xs text-muted-foreground">solicitações</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Em Andamento</CardTitle>
              <Clock className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {solicitacoes.filter(s => s.status === "em_andamento").length}
              </div>
              <p className="text-xs text-muted-foreground">solicitações</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
              <AlertCircle className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {solicitacoes.filter(s => s.status === "pendente").length}
              </div>
              <p className="text-xs text-muted-foreground">solicitações</p>
            </CardContent>
          </Card>
        </div>

        {/* Lista de Solicitações */}
        <Card>
          <CardHeader>
            <CardTitle>Suas Solicitações</CardTitle>
            <CardDescription>Acompanhe o andamento de todos os seus pedidos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {solicitacoes.map((solicitacao) => {
                const StatusIcon = getStatusIcon(solicitacao.status);
                return (
                  <div key={solicitacao.id} className="border rounded-lg p-4 hover:bg-secondary/50 transition-colors">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-start gap-3">
                        <StatusIcon className="h-5 w-5 text-muted-foreground mt-1" />
                        <div>
                          <h3 className="font-semibold text-lg">{solicitacao.titulo}</h3>
                          <p className="text-sm text-muted-foreground mb-2">{solicitacao.descricao}</p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span>Categoria: {solicitacao.categoria}</span>
                            <span>Aberto: {solicitacao.dataAbertura}</span>
                            <span>Prazo: {solicitacao.prazo}</span>
                            <span className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              {solicitacao.responsavel}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Badge className={getStatusColor(solicitacao.status)}>
                          {solicitacao.status.replace("_", " ")}
                        </Badge>
                        <Badge className={getPrioridadeColor(solicitacao.prioridade)}>
                          {solicitacao.prioridade}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        Ver Detalhes
                      </Button>
                      <Button size="sm" variant="outline">
                        Comentar
                      </Button>
                      {solicitacao.status === "pendente" && (
                        <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                          Cancelar
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}