import { Layout } from "@/components/Layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, User, MapPin, Phone } from "lucide-react";

export default function Agenda() {
  const compromissos = [
    {
      id: 1,
      titulo: "Reunião com Cliente ABC",
      horario: "09:00",
      data: "23/07/2025",
      cliente: "Empresa ABC Ltda",
      tipo: "Reunião",
      status: "confirmado",
      local: "Escritório - Sala 1",
      telefone: "(11) 99999-9999"
    },
    {
      id: 2,
      titulo: "Auditoria Empresa XYZ",
      horario: "14:00",
      data: "23/07/2025",
      cliente: "XYZ Comércio",
      tipo: "Auditoria",
      status: "pendente",
      local: "Cliente - Rua das Flores, 123",
      telefone: "(11) 88888-8888"
    },
    {
      id: 3,
      titulo: "Entrega de Documentos",
      horario: "16:30",
      data: "24/07/2025",
      cliente: "Indústria 123",
      tipo: "Entrega",
      status: "confirmado",
      local: "Cliente - Av. Principal, 456",
      telefone: "(11) 77777-7777"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmado": return "bg-green-100 text-green-800";
      case "pendente": return "bg-yellow-100 text-yellow-800";
      case "cancelado": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Agenda</h1>
            <p className="text-muted-foreground">Gerenciar compromissos e reuniões</p>
          </div>
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
            Novo Compromisso
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Hoje</CardTitle>
              <CardDescription>23 de Julho, 2025</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">2</div>
              <p className="text-sm text-muted-foreground">compromissos</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Esta Semana</CardTitle>
              <CardDescription>22 a 28 de Julho</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">8</div>
              <p className="text-sm text-muted-foreground">compromissos</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Pendentes</CardTitle>
              <CardDescription>Confirmação necessária</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">1</div>
              <p className="text-sm text-muted-foreground">compromisso</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Próximos Compromissos</CardTitle>
            <CardDescription>Lista de reuniões e atividades agendadas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {compromissos.map((compromisso) => (
                <div key={compromisso.id} className="border rounded-lg p-4 hover:bg-secondary/50 transition-colors">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold text-lg">{compromisso.titulo}</h3>
                      <p className="text-sm text-muted-foreground">{compromisso.cliente}</p>
                    </div>
                    <Badge className={getStatusColor(compromisso.status)}>
                      {compromisso.status}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{compromisso.data}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{compromisso.horario}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="truncate">{compromisso.local}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{compromisso.telefone}</span>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4">
                    <Button size="sm" variant="outline">
                      Editar
                    </Button>
                    <Button size="sm" variant="outline">
                      Confirmar
                    </Button>
                    <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                      Cancelar
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