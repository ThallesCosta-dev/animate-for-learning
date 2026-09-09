# Parapente Lab — Aplicativo Educacional Interativo

## O que vamos construir

Um aplicativo web completo em português para ensinar os fundamentos do parapente de forma visual e interativa: aerodinâmica, meteorologia e segurança, com simulações animadas, quiz e sistema de progresso.

## Observação sobre tecnologia

As bibliotecas pedidas (GSAP, Chart.js, Phaser.js) são todas gratuitas e open-source — vamos usá-las exatamente como combinado. Na plataforma Lovable elas são instaladas como dependências do projeto (em vez de CDN), mas o funcionamento no navegador é idêntico. A estrutura base usa React + TanStack, que é o padrão fixo da plataforma — isso não muda nada para o usuário final: o app roda direto no navegador.

## Telas e módulos

### 1. Página inicial
- Nome configurável "Parapente Lab" + subtítulo "Aprenda a entender o voo antes de voar"
- Foto real de parapente (repositório gratuito de uso livre)
- Aviso legal em destaque: ferramenta educacional, não substitui instrutor qualificado
- Menu: Aprender, Simulador, Meteorologia, Segurança, Quiz, Progresso

### 2. Aprender — Aerodinâmica (GSAP + Canvas + Chart.js)
- Asa interativa: clicar em cada componente (asa, linhas, tirantes, freios) e ver sua função
- Laboratório do perfil: controles de ângulo de ataque (0°–20°), velocidade, peso, densidade e área; partículas de ar fluindo sobre o perfil, vetores de sustentação/arrasto/peso
- Animação dedicada de ângulo de ataque com explicações que mudam conforme o valor
- Gráfico animado de sustentação x arrasto vs. velocidade (Chart.js)
- Animação de estol: separação progressiva do fluxo com partículas, caixa de aviso "representação simplificada"
- Simulação peso/carga alar com dois pilotos lado a lado
- Vento relativo vs. vento real: vetores coloridos, valores em km/h
- Planeio: trajetória, razão de planeio, vento de frente/cauda
- Modelo físico didático (L = ½ρV²S·CL) com aviso claro de aproximação educacional

### 3. Meteorologia
- Aulas curtas: temperatura, pressão, umidade, vento, gradiente térmico, convecção, nuvens, frentes, turbulência, relevo, brisas, convergência, cumulonimbus
- Animação da térmica: paisagem, sol, bolhas de ar quente; controles de aquecimento, horário, vento, umidade, terreno
- Ciclo de vida da térmica passo a passo com Play/Pause/Avançar/Voltar/velocidade
- Vento e relevo: partículas mostrando rotor e turbulência de sotavento
- Brisa de vale: botão Dia/Noite com paisagem e fluxo invertidos
- Nuvens clicáveis (cumulus, stratus, cumulonimbus) com riscos e sinais de perigo

### 4. Segurança
- Módulos Antes/Durante/Depois do voo
- Checklist interativo salvo no navegador, com "Iniciar" e "Recomeçar"
- Cenários de decisão com opções e explicação dos fatores

### 5. Simulador de voo (Phaser.js)
- Cena com montanhas, nuvens, térmicas, vento e área de pouso
- Controle por teclado, mouse e botões na tela para celular
- Painel com altitude, velocidade (km/h) e direção — propositalmente simplificado

### 6. Quiz e Progresso
- Perguntas de múltipla escolha, verdadeiro/falso e cenários, com explicação após cada resposta
- Pontuação e histórico
- Tela "Seu progresso" com percentuais por área; aulas marcáveis como concluídas
- Tudo salvo no navegador (localStorage) — sem necessidade de conta

### 7. Glossário
- Pesquisável, com definição simples + explicação técnica de cada termo

## Visual e experiência
- Tema claro e arejado: azul-escuro, azul-céu, branco, verde; laranja/amarelo para térmicas; vermelho só para alertas
- Cards e painéis, funcionando em desktop, tablet e celular
- Acessibilidade: navegação por teclado, contraste, opção "reduzir animações" (respeita prefers-reduced-motion)
- Cada aula no formato: pergunta inicial → animação → explicação → experimentação → resumo → mini quiz
- Valores numéricos sempre marcados como ilustrativos; vento em km/h

## Ordem de entrega
1. Base: tema, página inicial com foto e aviso, navegação, sistema de progresso
2. Aerodinâmica completa (maior prioridade pedagógica)
3. Meteorologia com térmica, relevo, brisa e nuvens
4. Segurança (checklist + cenários) e Quiz
5. Simulador de voo e Glossário

## Detalhes técnicos
- React + TanStack Start (estrutura fixa da plataforma), TypeScript
- GSAP para animações de vetores/transições, Canvas API para partículas, Chart.js para gráficos, Phaser.js apenas no simulador
- Persistência via localStorage (aulas concluídas, pontuação, preferências, reduzir animações)
- Sem backend nesta versão
