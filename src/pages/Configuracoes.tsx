import { Layout } from "@/components/Layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Settings, Users, Bell, Shield, Database, Mail } from "lucide-react";

export default function Configuracoes() {
  const configuracoes = [
    {
      categoria: "Perfil",
      icone: Users,
      itens: [
        { nome: "Informações Pessoais", descricao: "Alterar nome, email e telefone", ativo: true },
        { nome: "Senha", descricao: "Redefinir senha de acesso", ativo: true },
        { nome: "Foto de Perfil", descricao: "Alterar imagem do perfil", ativo: true }
      ]
    },
    {
      categoria: "Notificações",
      icone: Bell,
      itens: [
        { nome: "Email", descricao: "Receber notificações por email", ativo: true },
        { nome: "Push", descricao: "Notificações no navegador", ativo: false },
        { nome: "SMS", descricao: "Mensagens de texto para urgências", ativo: true }
      ]
    },
    {
      categoria: "Segurança",
      icone: Shield,
      itens: [
        { nome: "Autenticação 2FA", descricao: "Autenticação de dois fatores", ativo: false },
        { nome: "Sessões Ativas", descricao: "Gerenciar dispositivos conectados", ativo: true },
        { nome: "Log de Atividades", descricao: "Histórico de ações no sistema", ativo: true }
      ]
    },
    {
      categoria: "Sistema",
      icone: Database,
      itens: [
        { nome: "Backup Automático", descricao: "Backup diário dos dados", ativo: true },
        { nome: "Logs do Sistema", descricao: "Registro de atividades do sistema", ativo: true },
        { nome: "Manutenção", descricao: "Configurações de manutenção", ativo: false }
      ]
    },
    {
      categoria: "Integrações",
      icone: Mail,
      itens: [
        { nome: "API Externa", descricao: "Conexão com sistemas externos", ativo: false },
        { nome: "Webhooks", descricao: "Notificações automáticas", ativo: true },
        { nome: "Sincronização", descricao: "Sync com outros sistemas", ativo: true }
      ]
    }
  ];

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Configurações</h1>
            <p className="text-muted-foreground">Gerencie as configurações do sistema</p>
          </div>
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
            Salvar Alterações
          </Button>
        </div>

        {/* Informações do Sistema */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Versão do Sistema</CardTitle>
              <Settings className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">v2.1.4</div>
              <p className="text-xs text-muted-foreground">Última atualização</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Usuários Conectados</CardTitle>
              <Users className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">8</div>
              <p className="text-xs text-muted-foreground">usuários online</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Backup</CardTitle>
              <Database className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">22/07</div>
              <p className="text-xs text-muted-foreground">último backup</p>
            </CardContent>
          </Card>
        </div>

        {/* Configurações por Categoria */}
        <div className="space-y-6">
          {configuracoes.map((categoria, index) => {
            const IconeCategoria = categoria.icone;
            return (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <IconeCategoria className="h-5 w-5" />
                    {categoria.categoria}
                  </CardTitle>
                  <CardDescription>
                    Configurações relacionadas a {categoria.categoria.toLowerCase()}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {categoria.itens.map((item, itemIndex) => (
                      <div key={itemIndex} className="flex items-center justify-between p-4 border rounded-lg hover:bg-secondary/50 transition-colors">
                        <div>
                          <h4 className="font-medium">{item.nome}</h4>
                          <p className="text-sm text-muted-foreground">{item.descricao}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={item.ativo ? "default" : "secondary"}>
                            {item.ativo ? "Ativo" : "Inativo"}
                          </Badge>
                          <Button size="sm" variant="outline">
                            Configurar
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Zona de Perigo */}
        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="text-red-600">Zona de Perigo</CardTitle>
            <CardDescription>
              Ações irreversíveis que afetam permanentemente o sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg">
                <div>
                  <h4 className="font-medium text-red-600">Resetar Sistema</h4>
                  <p className="text-sm text-muted-foreground">Remove todos os dados e configurações</p>
                </div>
                <Button variant="destructive" size="sm">
                  Resetar
                </Button>
              </div>
              
              <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg">
                <div>
                  <h4 className="font-medium text-red-600">Exportar Dados</h4>
                  <p className="text-sm text-muted-foreground">Baixar backup completo antes de mudanças</p>
                </div>
                <Button variant="outline" size="sm">
                  Exportar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}