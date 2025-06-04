# Sistema de Agendamento Médico

Sistema web para agendamento de consultas médicas desenvolvido como parte do projeto acadêmico.

## Desenvolvedores
- Davi Vieira de Souza
- Gabriel Alencar de Araujo
- Riquelme da Silva Braga
- Thiago Derani Gurgel de Abreu Aquino

## Funcionalidades

### 1. Login
- Autenticação de usuários
- Recuperação de senha
- Lembrar usuário

### 2. Cadastro de Pacientes
- Formulário completo de cadastro
- Validação de dados em tempo real
- Formatação automática de CPF e telefone

### 3. Agendamento de Consultas
- Seleção de especialidade médica
- Escolha de médico
- Seleção de data e horário
- Gerenciamento de consultas

### 4. Consulta de Agendamentos
- Visualização de consultas marcadas
- Filtros por status e data
- Cancelamento de consultas

## Tecnologias Utilizadas
- HTML5
- CSS3
- JavaScript (ES6+)
- Armazenamento Local (LocalStorage/SessionStorage)

## Como Executar

1. Clone o repositório:
```bash
git clone https://github.com/alencarrgabriel/AgendamentoClinicaMedica.git
```

2. Abra o arquivo `index.html` em um navegador web moderno

3. Credenciais de teste:
- Email: teste@teste.com
- Senha: senha123

## Estrutura do Projeto
```
/
├── index.html           # Página de login
├── cadastro.html        # Página de cadastro
├── agendamento.html     # Página de agendamento
├── consulta.html        # Página de consultas
├── css/
│   └── styles.css      # Estilos globais
└── js/
    ├── login.js        # Lógica de login
    ├── cadastro.js     # Lógica de cadastro
    ├── validation.js   # Validações compartilhadas
    ├── agendamento.js  # Lógica de agendamento
    └── consulta.js     # Lógica de consultas
```

## Requisitos Não Funcionais
- Interface responsiva e acessível
- Operação 24/7
- Design limpo e intuitivo
- Segurança de dados
- Preparado para integrações futuras

## Histórico de Atualizações

### Última Atualização (Commit mais recente)
- Remoção dos arquivos do dashboard (dashboard.html, dashboard.css, dashboard.js)
- Simplificação da estrutura do projeto
- Otimização do fluxo de navegação

## Contribuição
Para contribuir com o projeto:
1. Faça um fork do repositório
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Faça commit das mudanças (`git commit -m 'Adiciona nova feature'`)
4. Faça push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## Controle de Versão
O projeto utiliza Git para controle de versão. Commits recentes:
- Remove dashboard files (último commit)
- Commits anteriores podem ser visualizados no histórico do repositório

## Status do Projeto
- Branch principal: `master`
- Estado atual: Em desenvolvimento ativo
- Última atualização: Remoção de componentes não utilizados para otimização 