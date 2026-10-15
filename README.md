# 🛡️ Pesquisa Técnica: Segurança e Proteção de Dados com Variáveis .env e HTTPS

## 1. Variáveis de Ambiente (`.env`) no Desenvolvimento Mobile
As **variáveis de ambiente** são parâmetros externos utilizados para configurar o comportamento de uma aplicação sem a necessidade de modificar diretamente o código-fonte. No desenvolvimento móvel, elas desempenham um papel crítico ao isolar dados sensíveis e configurações que variam de acordo com o estágio do projeto (Desenvolvimento, Homologação e Produção).


### O Risco do Hardcoding
Escrever chaves de API, credenciais ou strings de conexão diretamente no código (*hardcoding*) expõe severamente a aplicação. Se o código for enviado para repositórios públicos ou compartilhados (como o GitHub), qualquer agente malicioso poderá roubar essas chaves, gerando prejuízos financeiros (em APIs pagas) ou quebras de segurança nos serviços conectados.


### Solução no Ecossistema Expo: `expo-constants` e `dotenv`
No React Native com Expo, a leitura de arquivos `.env` é centralizada para garantir que o empacotador (Metro) injete as variáveis no código durante o build:
* **Prefixo `EXPO_PUBLIC_`:** Nas versões modernas do Expo, variáveis iniciadas com `EXPO_PUBLIC_` (ex: `EXPO_PUBLIC_API_URL`) são automaticamente detectadas e disponibilizadas globalmente no código através de `process.env.EXPO_PUBLIC_API_URL`, dispensando configurações complexas.
* **`expo-constants` ou `dotenv`:** Permitem que o aplicativo consuma dados definidos externamente e gerencie fluxos de requisição dinâmicos sem expor strings estáticas na estrutura do projeto enviado para produção.

---

## 2. Boas Práticas de Segurança em Repositórios: `.gitignore` e `.env.example`
A segurança da informação baseia-se no princípio de que segredos nunca devem entrar no histórico do sistema de controle de versão (Git).

### Arquitetura de Arquivos de Configuração
* **O arquivo `.gitignore`:** Funciona como um filtro de segurança. Ao adicionar a linha `.env` dentro dele, o Git é instruído a ignorar completamente as modificações desse arquivo, impedindo que ele seja rastreado, commitado ou enviado para a nuvem.
* **O arquivo `.env.example`:** Como o arquivo `.env` original fica oculto no repositório, os outros desenvolvedores da equipe não saberiam quais variáveis o aplicativo precisa para rodar. O `.env.example` serve como um **guia/molde público**. Ele contém os nomes de todas as variáveis necessárias, mas com valores em branco ou fictícios.

---

## 3. Comunicação Segura via HTTPS
O protocolo **HTTPS (Hypertext Transfer Protocol Secure)** é a espinha dorsal da segurança na comunicação entre dispositivos móveis e servidores web. Ele insere uma camada de criptografia sobre o protocolo HTTP tradicional utilizando o **TLS (Transport Layer Security)**.


### Pilares do HTTPS
1. **Confidencialidade:** Os dados trocados (como payloads de requisição e respostas da API) são criptografados. Mesmo que os pacotes sejam interceptados em uma rede Wi-Fi pública (ataques *Man-in-the-Middle*), eles estarão ilegíveis.
2. **Integridade:** Garante que os dados enviados pelo servidor não foram alterados ou corrompidos durante o trajeto até o aplicativo móvel.
3. **Autenticação:** O dispositivo móvel valida o **Certificado SSL/TLS** do servidor para garantir que está se comunicação com a entidade real (ex: o servidor oficial da API do GitHub ou ViaCEP) e não com um clone malicioso.


### Validação no React Native
Por padrão, tanto a API nativa `fetch` quanto a biblioteca `axios` rejeitam conexões HTTP não seguras em ambientes de produção, exigindo URLs obrigatoriamente iniciadas em `https://`. No desenvolvimento mobile, a validação estrita dessas URLs previne o tráfego de dados sensíveis em texto puro pela rede.
