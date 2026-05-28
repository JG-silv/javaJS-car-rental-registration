# Locadora - Cadastro, Login e Geografia por UF

Aplicação web em HTML, CSS e JavaScript para cadastro de locações, login, visualização de detalhes do veículo e integração com dados do IBGE.

## Visão Geral

Este projeto simula um fluxo simples de locadora:

- cadastro de locador e veículo
- validação de campos e progresso do formulário
- login por CPF e placa
- exibição de detalhes do veículo selecionado
- integração com a API do IBGE para carregar estados e malhas simplificadas por Unidade da Federação
- persistência local dos cadastros com IndexedDB

## Funcionalidades

### Formulário principal
- cadastro de dados do locador
- seleção de categoria, modelo e acessórios
- escolha da UF com carregamento dinâmico da API do IBGE
- visualização da malha simplificada da UF selecionada
- barra de progresso do preenchimento

### Persistência local
- clientes salvos em IndexedDB (`locadora-ibge-db`)
- cache de UFs e mapas simplificados também armazenado localmente

### Tela de detalhes
- mostra os dados do cliente logado
- exibe imagem do veículo com destaque visual
- retorna ao formulário principal

## Estrutura do projeto

- `pages/locterCars.html` — tela principal de cadastro/login
- `pages/dadoscliente.html` — tela de detalhes da locação
- `pages/js/scripts.js` — lógica de validação, cadastro, login e integração com o banco local
- `pages/js/ibge.js` — integração com a API do IBGE e IndexedDB
- `pages/css/styles.css` — estilos da tela principal
- `pages/css/style-dados.css` — estilos da tela de detalhes

## Tecnologias utilizadas

- HTML5
- CSS3
- JavaScript puro
- IndexedDB (persistência local)
- API do IBGE:
  - `https://servicodados.ibge.gov.br/api/v1/localidades/estados`
  - `https://servicodados.ibge.gov.br/api/v4/malhas/estados/{UF}`

## Como executar

### Opção 1: abrir localmente
1. Abra o arquivo `pages/locterCars.html` em um navegador.

### Opção 2: usar servidor local simples
Se preferir, utilize uma extensão como Live Server no VS Code ou rode um servidor estático na pasta raiz.

Exemplo com Python:

```bash
python -m http.server 8000
```

Depois aceda em:

```text
http://localhost:8000/pages/locterCars.html
```

## Fluxo de uso

1. A página inicial carrega as UFs diretamente do IBGE.
2. Selecione uma UF para visualizar a malha simplificada.
3. Preencha o formulário de cadastro.
4. Clique em **Cadastrar** para salvar o cliente no IndexedDB.
5. Faça login com CPF e placa.
6. A página de detalhes mostra o resumo da locação e a imagem do veículo.

## Observações

- Os dados ficam salvos no navegador do usuário.
- O projeto é estático, sem backend, então não há banco de dados remoto.
- A API do IBGE é usada para mapas e listagem de estados.

## Autor
José - JG-silv
Projeto desenvolvido como aplicação web front-end com integração externa e armazenamento local.
#
