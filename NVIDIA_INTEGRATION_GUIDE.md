# Integração NVIDIA AI com ATHOS Business Management Platform

Este guia explica como configurar e usar a integração com os serviços de IA da NVIDIA no projeto ATHOS.

## Pré-requisitos

1. Conta no NVIDIA AI Foundations (https://www.nvidia.com/ai-foundations/)
2. Chave de API válida para acesso aos modelos NVIDIA (como Nemotron-3)

## Configuração

1. Obtenha sua chave de API da NVIDIA AI Foundations
2. No arquivo `.env` na raiz do projeto, substitua:
   ```
   VITE_NVIDIA_API_KEY=sua_chave_de_api_aqui
   ```
   por:
   ```
   VITE_NVIDIA_API_KEY=seu_token_real_aqui
   ```

3. Reinicie o servidor de desenvolvimento se estiver rodando:
   ```bash
   npm run dev
   ```

## Como Funciona

A integração substitui as respostas estáticas do assistente de IA por chamadas dinâmicas para os modelos de linguagem da NVIDIA, proporcionando:

- **Insights de negócios mais sofisticados** baseado em contexto real dos dados
- **Sugestões de automação personalizadas** para diferentes áreas do negócio
- **Análises preditivas avançadas** para fluxo de caixa, receitas e despesas
- **Geração de mensagens de voz com emoção** usando processamento de linguagem natural

## Uso

Após configurar a chave de API:

1. Acesse o módulo ATHOSAI ou abra o assistente de AI (ícone de robô no canto inferior direito)
2. Faça perguntas como:
   - "Como está o fluxo de caixa?"
   - "Quais oportunidades de economia existem?"
   - "Gere um relatório executivo"
   - "Análise de despesas do mês"

3. O sistema enviará sua consulta para os modelos NVIDIA e retornará respostas avançadas baseadas em IA

## Arquivos Modificados/Criados

- `src/services/nvidia.ts` - Serviço de integração com NVIDIA AI Foundations
- `src/components/AIAssistant.tsx` - Assistente de IA aprimorado para usar NVIDIA
- `.env` - Adicionada variável VITE_NVIDIA_API_KEY
- `NVIDIA_INTEGRATION_GUIDE.md` - Este guia

## Segurança

**NUNCA** compartilhe seu arquivo .env ou exponha sua chave de API em repositórios públicos. A chave é usada apenas no lado do cliente para demonstração, mas em produção recomendaria mover essas chamadas para um backend seguro.

## Solução de Problemas

Se você ver mensagens de erro sobre API key:
1. Verifique se a chave foi configurada corretamente no .env
2. Certifique-se de que não há espaços extras antes ou depois da chave
3. Verifique se sua conta NVIDIA AI Foundations tem acesso ativo aos modelos

Se as respostas parecem genéricas:
1. A integração inclui fallbacks para respostas básicas se a API falhar
2. Verifique o console do desenvolvedor para mensagens de erro detalhadas