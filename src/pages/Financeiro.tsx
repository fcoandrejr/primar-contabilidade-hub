import { Layout } from "@/components/Layout/Layout";

export default function Financeiro() {
  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Financeiro</h1>
          <p className="text-muted-foreground">Controle financeiro do escritório</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold mb-2">Receita Mensal</h3>
            <p className="text-3xl font-bold text-green-600">R$ 67.000</p>
            <p className="text-sm text-muted-foreground">+12% em relação ao mês anterior</p>
          </div>
          
          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold mb-2">Despesas</h3>
            <p className="text-3xl font-bold text-red-600">R$ 23.500</p>
            <p className="text-sm text-muted-foreground">-5% em relação ao mês anterior</p>
          </div>

          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold mb-2">Lucro Líquido</h3>
            <p className="text-3xl font-bold text-blue-600">R$ 43.500</p>
            <p className="text-sm text-muted-foreground">+18% em relação ao mês anterior</p>
          </div>

          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold mb-2">Pendências</h3>
            <p className="text-3xl font-bold text-orange-600">R$ 8.200</p>
            <p className="text-sm text-muted-foreground">3 faturas em aberto</p>
          </div>
        </div>

        <div className="glass-card p-6">
          <h2 className="text-xl font-semibold mb-4">Fluxo de Caixa</h2>
          <p className="text-muted-foreground">Gráfico do fluxo de caixa será implementado aqui.</p>
        </div>
      </div>
    </Layout>
  );
}