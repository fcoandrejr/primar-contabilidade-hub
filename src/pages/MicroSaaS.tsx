import { Layout } from "@/components/Layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building2, DollarSign, Users, TrendingUp, Settings, Globe } from "lucide-react";

export default function MicroSaaS() {
  const produtos = [
    {
      id: 1,
      nome: "Contador Digital",
      descricao: "Plataforma de contabilidade online para pequenas empresas",
      usuarios: 1247,
      receita: "R$ 18.500",
      crescimento: "+23%",
      status: "ativo",
      planos: ["Básico", "Profissional", "Enterprise"]
    },
    {
      id: 2,
      nome: "Fiscal Express",
      descricao: "Sistema automatizado para cálculo e emissão de guias fiscais",
      usuarios: 856,
      receita: "R$ 12.300",
      crescimento: "+15%",
      status: "ativo",
      planos: ["Starter", "Premium"]
    },
    {
      id: 3,
      nome: "Doc Manager",
      descricao: "Gerenciador de documentos com assinatura digital",
      usuarios: 423,
      receita: "R$ 6.800",
      crescimento: "+8%",
      status: "beta",
      planos: ["Básico", "Pro"]
    }
  ];

  const metricas = [
    {
      titulo: "Receita Total MRR",
      valor: "R$ 37.600",
      variacao: "+18%",
      icone: DollarSign,
      cor: "text-green-600"
    },
    {
      titulo: "Usuários Ativos",
      valor: "2.526",
      variacao: "+156",
      icone: Users,
      cor: "text-blue-600"
    },
    {
      titulo: "Taxa de Conversão",
      valor: "3.2%",
      variacao: "+0.5%",
      icone: TrendingUp,
      cor: "text-purple-600"
    },
    {
      titulo: "Produtos Ativos",
      valor: "3",
      variacao: "+1",
      icone: Building2,
      cor: "text-orange-600"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ativo": return "bg-green-100 text-green-800";
      case "beta": return "bg-blue-100 text-blue-800";
      case "desenvolvimento": return "bg-yellow-100 text-yellow-800";
      case "pausado": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">MicroSaaS</h1>
            <p className="text-muted-foreground">Gestão dos produtos SaaS do escritório</p>
          </div>
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
            Novo Produto
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
                    {metrica.variacao} este mês
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Gráfico de Performance */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Receita por Produto</CardTitle>
              <CardDescription>Últimos 3 meses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
                <div className="text-center">
                  <DollarSign className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                  <p className="text-gray-500">Gráfico de receita por produto</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Crescimento de Usuários</CardTitle>
              <CardDescription>Usuários ativos mensais</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
                <div className="text-center">
                  <Users className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                  <p className="text-gray-500">Gráfico de crescimento</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Lista de Produtos */}
        <Card>
          <CardHeader>
            <CardTitle>Produtos SaaS</CardTitle>
            <CardDescription>Gestão completa dos seus produtos digitais</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {produtos.map((produto) => (
                <div key={produto.id} className="border rounded-lg p-6 hover:bg-secondary/50 transition-colors">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-3">
                      <Building2 className="h-6 w-6 text-primary mt-1" />
                      <div>
                        <h3 className="text-xl font-semibold">{produto.nome}</h3>
                        <p className="text-muted-foreground mb-3">{produto.descricao}</p>
                        <div className="flex gap-2 mb-3">
                          {produto.planos.map((plano, index) => (
                            <Badge key={index} variant="outline">
                              {plano}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    <Badge className={getStatusColor(produto.status)}>
                      {produto.status}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="text-center p-3 bg-secondary/30 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{produto.usuarios.toLocaleString()}</div>
                      <div className="text-sm text-muted-foreground">Usuários</div>
                    </div>
                    <div className="text-center p-3 bg-secondary/30 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{produto.receita}</div>
                      <div className="text-sm text-muted-foreground">Receita MRR</div>
                    </div>
                    <div className="text-center p-3 bg-secondary/30 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">{produto.crescimento}</div>
                      <div className="text-sm text-muted-foreground">Crescimento</div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Settings className="h-4 w-4 mr-1" />
                      Configurar
                    </Button>
                    <Button size="sm" variant="outline">
                      <TrendingUp className="h-4 w-4 mr-1" />
                      Analytics
                    </Button>
                    <Button size="sm" variant="outline">
                      <Users className="h-4 w-4 mr-1" />
                      Usuários
                    </Button>
                    <Button size="sm" variant="outline">
                      <Globe className="h-4 w-4 mr-1" />
                      Acessar
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}