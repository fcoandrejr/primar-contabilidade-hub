import { Layout } from "@/components/Layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DollarSign, TrendingUp, TrendingDown, CreditCard, Users, FileText, Calendar } from "lucide-react";

export default function Financeiro() {
  const transacoes = [
    {
      id: 1,
      descricao: "Honorários - Empresa ABC",
      valor: 8500,
      tipo: "receita",
      data: "22/07/2025",
      cliente: "Empresa ABC Ltda",
      categoria: "Serviços Contábeis"
    },
    {
      id: 2,
      descricao: "Aluguel do Escritório",
      valor: -4200,
      tipo: "despesa",
      data: "20/07/2025",
      cliente: "Imobiliária XYZ",
      categoria: "Infraestrutura"
    },
    {
      id: 3,
      descricao: "Declaração IR - Cliente 123",
      valor: 750,
      tipo: "receita",
      data: "19/07/2025",
      cliente: "João Silva",
      categoria: "Serviços Fiscais"
    },
    {
      id: 4,
      descricao: "Software de Gestão",
      valor: -890,
      tipo: "despesa",
      data: "18/07/2025",
      cliente: "TechSoft",
      categoria: "Tecnologia"
    },
    {
      id: 5,
      descricao: "Consultoria Tributária",
      valor: 3200,
      tipo: "receita",
      data: "17/07/2025",
      cliente: "Indústria 456",
      categoria: "Consultoria"
    }
  ];

  const metricas = [
    {
      titulo: "Receita Mensal",
      valor: "R$ 67.000",
      variacao: "+12%",
      icone: DollarSign,
      cor: "text-green-600",
      trend: "up"
    },
    {
      titulo: "Despesas",
      valor: "R$ 23.500",
      variacao: "-5%",
      icone: CreditCard,
      cor: "text-red-600",
      trend: "down"
    },
    {
      titulo: "Lucro Líquido",
      valor: "R$ 43.500",
      variacao: "+18%",
      icone: TrendingUp,
      cor: "text-blue-600",
      trend: "up"
    },
    {
      titulo: "Margem",
      valor: "65%",
      variacao: "+3%",
      icone: TrendingUp,
      cor: "text-purple-600",
      trend: "up"
    }
  ];

  const faturasPendentes = [
    { cliente: "Empresa ABC", valor: "R$ 2.500", vencimento: "25/07/2025", dias: 3 },
    { cliente: "Comércio XYZ", valor: "R$ 1.800", vencimento: "28/07/2025", dias: 6 },
    { cliente: "Indústria 123", valor: "R$ 3.900", vencimento: "30/07/2025", dias: 8 }
  ];

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Financeiro</h1>
            <p className="text-muted-foreground">Controle financeiro completo do escritório</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              Exportar Relatório
            </Button>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              Nova Transação
            </Button>
          </div>
        </div>

        {/* Métricas Principais */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {metricas.map((metrica, index) => {
            const IconComponent = metrica.icone;
            const TrendIcon = metrica.trend === "up" ? TrendingUp : TrendingDown;
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
                  <p className={`text-xs flex items-center gap-1 ${metrica.cor}`}>
                    <TrendIcon className="h-3 w-3" />
                    {metrica.variacao} em relação ao mês anterior
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Transações Recentes */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Transações Recentes</CardTitle>
                <CardDescription>Últimas movimentações financeiras</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {transacoes.map((transacao) => (
                    <div key={transacao.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-secondary/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${transacao.tipo === 'receita' ? 'bg-green-500' : 'bg-red-500'}`} />
                        <div>
                          <h4 className="font-medium">{transacao.descricao}</h4>
                          <p className="text-sm text-muted-foreground">{transacao.cliente}</p>
                          <p className="text-xs text-muted-foreground">{transacao.categoria}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-bold ${transacao.tipo === 'receita' ? 'text-green-600' : 'text-red-600'}`}>
                          {transacao.tipo === 'receita' ? '+' : ''}{transacao.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </p>
                        <p className="text-sm text-muted-foreground">{transacao.data}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Faturas Pendentes */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Faturas Pendentes</CardTitle>
                <CardDescription>Pagamentos em aberto</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {faturasPendentes.map((fatura, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h4 className="font-medium text-sm">{fatura.cliente}</h4>
                        <p className="text-xs text-muted-foreground">Vence em {fatura.dias} dias</p>
                        <p className="text-xs text-muted-foreground">{fatura.vencimento}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-orange-600">{fatura.valor}</p>
                        <Button size="sm" variant="outline" className="mt-1">
                          Cobrar
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Gráfico de Fluxo de Caixa */}
        <Card>
          <CardHeader>
            <CardTitle>Fluxo de Caixa</CardTitle>
            <CardDescription>Evolução financeira dos últimos 6 meses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
              <div className="text-center">
                <TrendingUp className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                <p className="text-gray-500">Gráfico de fluxo de caixa será implementado aqui</p>
                <p className="text-sm text-gray-400">Receitas vs Despesas por mês</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}