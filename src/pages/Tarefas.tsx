import { Layout } from "@/components/Layout/Layout";
import { Badge } from "@/components/ui/badge";

export default function Tarefas() {
  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Tarefas</h1>
          <p className="text-muted-foreground">Gerenciamento de tarefas e atividades</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold mb-4">A Fazer</h3>
            <div className="space-y-3">
              <div className="p-3 border rounded-lg">
                <h4 className="font-medium">Análise fiscal - Empresa ABC</h4>
                <p className="text-sm text-muted-foreground">Vencimento: 25/07/2025</p>
                <Badge variant="destructive" className="mt-2">Urgente</Badge>
              </div>
              <div className="p-3 border rounded-lg">
                <h4 className="font-medium">Relatório mensal</h4>
                <p className="text-sm text-muted-foreground">Vencimento: 30/07/2025</p>
                <Badge variant="secondary" className="mt-2">Normal</Badge>
              </div>
            </div>
          </div>

          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold mb-4">Em Progresso</h3>
            <div className="space-y-3">
              <div className="p-3 border rounded-lg">
                <h4 className="font-medium">Auditoria - Empresa XYZ</h4>
                <p className="text-sm text-muted-foreground">Vencimento: 28/07/2025</p>
                <Badge variant="default" className="mt-2">Em andamento</Badge>
              </div>
            </div>
          </div>

          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold mb-4">Concluído</h3>
            <div className="space-y-3">
              <div className="p-3 border rounded-lg opacity-60">
                <h4 className="font-medium">Declaração IR - Cliente 123</h4>
                <p className="text-sm text-muted-foreground">Concluído em: 22/07/2025</p>
                <Badge variant="outline" className="mt-2">Finalizado</Badge>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}