import { Layout } from "@/components/Layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BarChart3, TrendingUp, DollarSign, Users, FileText, Calendar } from "lucide-react";

export default function Relatorios() {
  const relatorios = [
    {
      id: 1,
      nome: "Relatório Financeiro Mensal",
      descricao: "Análise completa das receitas e despesas do mês",
      periodo: "Julho 2025",
      status: "atualizado",
      ultimaAtualizacao: "22/07/2025",
      tipo: "financeiro"
    },
    {
      id: 2,
      nome: "Relatório de Clientes",
      descricao: "Lista completa de clientes ativos e inativos",
      periodo: "2025",
      status: "pendente",
      ultimaAtualizacao: "20/07/2025",
      tipo: "clientes"
    },
    {
      id: 3,
      nome: "Relatório de Produtividade",
      descricao: "Análise de tarefas concluídas por funcionário",
      periodo: "Julho 2025",
      status: "atualizado",
      ultimaAtualizacao: "22/07/2025",
      tipo: "produtividade"
    },
    {
      id: 4,
      nome: "Relatório de Documentos",
      descricao: "Status de documentos enviados e processados",
      periodo: "Julho 2025",
      status: "processando",
      ultimaAtualizacao: "21/07/2025",
      tipo: "documentos"
    }
  ];

  const metricas = [
    {
      titulo: "Receita Total",
      valor: "R$ 67.000",
      variacao: "+12%",
      icone: DollarSign,
      cor: "text-green-600"
    },
    {
      titulo: "Clientes Ativos",
      valor: "127",
      variacao: "+5",
      icone: Users,
      cor: "text-blue-600"
    },
    {
      titulo: "Documentos Processados",
      valor: "245",
      variacao: "+18%",
      icone: FileText,
      cor: "text-purple-600"
    },
    {
      titulo: "Taxa de Conclusão",
      valor: "94%",
      variacao: "+3%",
      icone: TrendingUp,
      cor: "text-orange-600"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "atualizado": return "bg-green-100 text-green-800";
      case "pendente": return "bg-yellow-100 text-yellow-800";
      case "processando": return "bg-blue-100 text-blue-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case "financeiro": return DollarSign;
      case "clientes": return Users;
      case "produtividade": return TrendingUp;
      case "documentos": return FileText;
      default: return BarChart3;
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Relatórios</h1>
            <p className="text-muted-foreground">Análises e relatórios do escritório</p>
          </div>
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
            Gerar Relatório
          </Button>
        </div>

        {/* Métricas */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {metricas.map((metrica, index) => {
            const IconComponent = metrica.icone;
            return (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {metrica.titulo}
                  </CardTitle>
                  <IconComponent className={`h-4 w-4 ${metrica.cor}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{metrica.valor}</div>
                  <p className={`text-xs ${metrica.cor}`}>
                    {metrica.variacao} desde o mês passado
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Gráficos */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Receita por Mês</CardTitle>
              <CardDescription>Últimos 6 meses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
                <div className="text-center">
                  <BarChart3 className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                  <p className="text-gray-500">Gráfico de receita mensal</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Distribuição de Clientes</CardTitle>
              <CardDescription>Por tipo de serviço</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
                <div className="text-center">
                  <Users className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                  <p className="text-gray-500">Gráfico de distribuição</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Lista de Relatórios */}
        <Card>
          <CardHeader>
            <CardTitle>Relatórios Disponíveis</CardTitle>
            <CardDescription>Baixe ou visualize relatórios detalhados</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {relatorios.map((relatorio) => {
                const IconComponent = getTipoIcon(relatorio.tipo);
                return (
                  <div key={relatorio.id} className="border rounded-lg p-4 hover:bg-secondary/50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <IconComponent className="h-5 w-5 text-muted-foreground mt-1" />
                        <div>
                          <h3 className="font-semibold">{relatorio.nome}</h3>
                          <p className="text-sm text-muted-foreground mb-2">{relatorio.descricao}</p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              Período: {relatorio.periodo}
                            </span>
                            <span>Atualizado: {relatorio.ultimaAtualizacao}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(relatorio.status)}>
                          {relatorio.status}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 mt-4">
                      <Button size="sm" variant="outline">
                        Visualizar
                      </Button>
                      <Button size="sm" variant="outline">
                        Baixar PDF
                      </Button>
                      <Button size="sm" variant="outline">
                        Exportar Excel
                      </Button>
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