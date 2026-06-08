import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpApi from 'i18next-http-backend';

// In a real app, you would fetch translations from an API
// For now, we'll use hardcoded resources
const resources = {
  en: {
    translation: {
      "app": {
        "title": "ATHOS Business Management",
        "welcome": "Welcome to ATHOS",
        "dashboard": "Dashboard",
        "socios": "Partners & Directors",
        "drive": "ATHOS Drive",
        "flow": "ATHOS Flow",
        "leads": "Leads",
        "funil": "Sales Funnel",
        "whatsapp": "WhatsApp",
        "finance": "ATHOS Finance",
        "contas-pagar": "Accounts Payable",
        "contas-receber": "Accounts Receivable",
        "fluxo-caixa": "Cash Flow",
        "dre": "DRE",
        "previsao": "AI Forecast",
        "sign": "ATHOS Sign",
        "contratos": "Contracts",
        "modelos": "Templates",
        "assinaturas": "Subscriptions",
        "ai": "ATHOS AI",
        "chatbot": "Chatbot",
        "relatorios-ia": "AI Reports",
        "support": "ATHOS Support",
        "chamados": "Tickets",
        "inventario": "Inventory",
        "projects": "ATHOS Projects",
        "tarefas": "Tasks",
        "kanban": "Kanban",
        "people": "ATHOS People",
        "funcionarios": "Employees",
        "ponto": "Digital Clock",
        "onboarding": "Onboarding",
        "shield": "ATHOS Shield",
        "cameras": "Cameras",
        "alertas": "Alerts",
        "ativos": "Assets",
        "financeiro": "Financial",
        "setores": "Sectors",
        "relatorios": "Reports",
        "banco-dados": "Database",
        "usuarios": "Users",
        "seguranca": "Security",
        "configuracoes": "Settings",
        "despesas": "Expenses",
        "sharepoints": "Cambom Points"
      },
      "auth": {
        "login": "Sign In",
        "email": "Email",
        "password": "Password",
        "show_password": "Show Password",
        "hide_password": "Hide Password",
        "forgot_password": "Forgot Password?",
        "sign_in": "Sign In",
        "sign_up": "Sign Up",
        "dont_have_account": "Don't have an account?",
        "already_have_account": "Already have an account?",
        "welcome_back": "Welcome back!",
        "enter_credentials": "Please enter your credentials to continue",
        "invalid_credentials": "Invalid email or password",
        "email_required": "Email is required",
        "password_required": "Password is required",
        "invalid_email": "Please enter a valid email",
        "min_length": "Must be at least {{count}} characters"
      },
      "common": {
        "save": "Save",
        "cancel": "Cancel",
        "delete": "Delete",
        "edit": "Edit",
        "create": "Create",
        "update": "Update",
        "search": "Search",
        "filter": "Filter",
        "clear": "Clear",
        "loading": "Loading...",
        "no_results": "No results found",
        "select_option": "Select an option",
        "required_field": "This field is required",
        "success": "Success",
        "error": "Error",
        "warning": "Warning",
        "info": "Information",
        "yes": "Yes",
        "no": "No",
        "close": "Close",
        "submit": "Submit"
      }
    }
  },
  "pt-BR": {
    translation: {
      "app": {
        "title": "ATHOS Gestão Empresarial",
        "welcome": "Bem-vindo ao ATHOS",
        "dashboard": "Dashboard",
        "socios": "Sócios & Diretores",
        "drive": "ATHOS Drive",
        "flow": "ATHOS Flow",
        "leads": "Leads",
        "funil": "Funil Comercial",
        "whatsapp": "WhatsApp",
        "finance": "ATHOS Finance",
        "contas-pagar": "Contas a Pagar",
        "contas-receber": "Contas a Receber",
        "fluxo-caixa": "Fluxo de Caixa",
        "dre": "DRE",
        "previsao": "Previsão IA",
        "sign": "ATHOS Sign",
        "contratos": "Contratos",
        "modelos": "Modelos",
        "assinaturas": "Assinaturas",
        "ai": "ATHOS AI",
        "chatbot": "Chatbot",
        "relatorios-ia": "Relatórios IA",
        "support": "ATHOS Support",
        "chamados": "Chamados",
        "inventario": "Inventário",
        "projects": "ATHOS Projects",
        "tarefas": "Tarefas",
        "kanban": "Kanban",
        "people": "ATHOS People",
        "funcionarios": "Funcionários",
        "ponto": "Ponto Digital",
        "onboarding": "Onboarding",
        "shield": "ATHOS Shield",
        "cameras": "Câmeras",
        "alertas": "Alertas",
        "ativos": "Ativos",
        "financeiro": "Financeiro",
        "setores": "Setores",
        "relatorios": "Relatórios",
        "banco-dados": "Banco de Dados",
        "usuarios": "Usuários",
        "seguranca": "Segurança",
        "configuracoes": "Configurações",
        "despesas": "Despesas",
        "sharepoints": "Cambom Pontos"
      },
      "auth": {
        "login": "Entrar",
        "email": "E-mail",
        "password": "Senha",
        "show_password": "Mostrar Senha",
        "hide_password": "Ocultar Senha",
        "forgot_password": "Esqueceu a senha?",
        "sign_in": "Entrar",
        "sign_up": "Cadastrar",
        "dont_have_account": "Não tem uma conta?",
        "already_have_account": "Já tem uma conta?",
        "welcome_back": "Bem-vindo de volta!",
        "enter_credentials": "Por favor, informe suas credenciais para continuar",
        "invalid_credentials": "E-mail ou senha inválidos",
        "email_required": "E-mail é obrigatório",
        "password_required": "Senha é obrigatória",
        "invalid_email": "Por favor, informe um e-mail válido",
        "min_length": "Deve ter pelo menos {{count}} caracteres"
      },
      "common": {
        "save": "Salvar",
        "cancel": "Cancelar",
        "delete": "Excluir",
        "edit": "Editar",
        "create": "Criar",
        "update": "Atualizar",
        "search": "Buscar",
        "filter": "Filtrar",
        "clear": "Limpar",
        "loading": "Carregando...",
        "no_results": "Nenhum resultado encontrado",
        "select_option": "Selecione uma opção",
        "required_field": "Este campo é obrigatório",
        "success": "Sucesso",
        "error": "Erro",
        "warning": "Aviso",
        "info": "Informação",
        "yes": "Sim",
        "no": "Não",
        "close": "Fechar",
        "submit": "Enviar"
      }
    }
  }
};

i18n
  .use(HttpApi)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    lng: 'pt-BR', // default language
    fallbackLng: 'en',
    debug: false,
    interpolation: {
      escapeValue: false
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage']
    }
  });

export default i18n;