import { Layout } from "@/components/Layout/Layout";

export default function Funcionarios() {
  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Funcionários</h1>
          <p className="text-muted-foreground">Gestão de funcionários e colaboradores</p>
        </div>

        <div className="glass-card p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Lista de Funcionários</h2>
            <button className="btn-primary">
              Adicionar Funcionário
            </button>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h3 className="font-semibold">João Silva</h3>
                <p className="text-sm text-muted-foreground">Contador</p>
              </div>
              <div className="text-right">
                <p className="font-semibold">R$ 5.500</p>
                <p className="text-sm text-muted-foreground">Salário</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h3 className="font-semibold">Maria Santos</h3>
                <p className="text-sm text-muted-foreground">Assistente Administrativa</p>
              </div>
              <div className="text-right">
                <p className="font-semibold">R$ 3.200</p>
                <p className="text-sm text-muted-foreground">Salário</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h3 className="font-semibold">Pedro Costa</h3>
                <p className="text-sm text-muted-foreground">Analista Fiscal</p>
              </div>
              <div className="text-right">
                <p className="font-semibold">R$ 4.800</p>
                <p className="text-sm text-muted-foreground">Salário</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}