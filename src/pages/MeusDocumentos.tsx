import { Layout } from "@/components/Layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, Clock, CheckCircle } from "lucide-react";

export default function MeusDocumentos() {
  const documentos = [
    {
      id: 1,
      nome: "Declaração de IR 2024",
      tipo: "Imposto de Renda",
      dataEnvio: "15/07/2025",
      status: "aprovado",
      tamanho: "2.5 MB",
      protocolo: "IR2024-001234"
    },
    {
      id: 2,
      nome: "Certidão Negativa de Débitos",
      tipo: "Certidão",
      dataEnvio: "18/07/2025",
      status: "processando",
      tamanho: "1.8 MB",
      protocolo: "CND2025-005678"
    },
    {
      id: 3,
      nome: "Balancete Patrimonial",
      tipo: "Contabilidade",
      dataEnvio: "20/07/2025",
      status: "pendente",
      tamanho: "3.2 MB",
      protocolo: "BP2025-009876"
    },
    {
      id: 4,
      nome: "Guias de Recolhimento",
      tipo: "Tributário",
      dataEnvio: "22/07/2025",
      status: "aprovado",
      tamanho: "1.2 MB",
      protocolo: "GR2025-001122"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "aprovado": return "bg-green-100 text-green-800";
      case "pendente": return "bg-yellow-100 text-yellow-800";
      case "processando": return "bg-blue-100 text-blue-800";
      case "rejeitado": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "aprovado": return CheckCircle;
      case "processando": return Clock;
      default: return FileText;
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Meus Documentos</h1>
            <p className="text-muted-foreground">Visualize e baixe seus documentos</p>
          </div>
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
            Solicitar Documento
          </Button>
        </div>

        {/* Resumo */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{documentos.length}</div>
              <p className="text-xs text-muted-foreground">documentos</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Aprovados</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {documentos.filter(d => d.status === "aprovado").length}
              </div>
              <p className="text-xs text-muted-foreground">documentos</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Processando</CardTitle>
              <Clock className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {documentos.filter(d => d.status === "processando").length}
              </div>
              <p className="text-xs text-muted-foreground">documentos</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {documentos.filter(d => d.status === "pendente").length}
              </div>
              <p className="text-xs text-muted-foreground">documentos</p>
            </CardContent>
          </Card>
        </div>

        {/* Lista de Documentos */}
        <Card>
          <CardHeader>
            <CardTitle>Seus Documentos</CardTitle>
            <CardDescription>Lista completa de documentos enviados e processados</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {documentos.map((documento) => {
                const StatusIcon = getStatusIcon(documento.status);
                return (
                  <div key={documento.id} className="border rounded-lg p-4 hover:bg-secondary/50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <StatusIcon className="h-5 w-5 text-muted-foreground mt-1" />
                        <div>
                          <h3 className="font-semibold">{documento.nome}</h3>
                          <p className="text-sm text-muted-foreground">{documento.tipo}</p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground mt-2">
                            <span>Protocolo: {documento.protocolo}</span>
                            <span>Enviado: {documento.dataEnvio}</span>
                            <span>Tamanho: {documento.tamanho}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(documento.status)}>
                          {documento.status}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 mt-4">
                      <Button size="sm" variant="outline">
                        <Download className="h-4 w-4 mr-1" />
                        Baixar
                      </Button>
                      <Button size="sm" variant="outline">
                        Visualizar
                      </Button>
                      {documento.status === "aprovado" && (
                        <Button size="sm" variant="outline">
                          Compartilhar
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