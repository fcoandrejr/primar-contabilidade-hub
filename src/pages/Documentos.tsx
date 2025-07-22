import { Layout } from "@/components/Layout/Layout";

export default function Documentos() {
  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Documentos</h1>
          <p className="text-muted-foreground">Gestão de documentos e arquivos</p>
        </div>

        <div className="glass-card p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Documentos Recentes</h2>
            <button className="btn-primary">
              Adicionar Documento
            </button>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h3 className="font-semibold">Declaração IR 2024 - Empresa ABC</h3>
                <p className="text-sm text-muted-foreground">Enviado em 20/07/2025</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-green-600 font-medium">Aprovado</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h3 className="font-semibold">Balancete Mensal - Empresa XYZ</h3>
                <p className="text-sm text-muted-foreground">Enviado em 19/07/2025</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-orange-600 font-medium">Em análise</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h3 className="font-semibold">Certificado Digital - Cliente 123</h3>
                <p className="text-sm text-muted-foreground">Enviado em 18/07/2025</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-blue-600 font-medium">Processando</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}