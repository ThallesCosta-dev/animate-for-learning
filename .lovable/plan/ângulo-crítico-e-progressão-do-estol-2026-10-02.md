# Ângulo crítico e progressão do estol

## Objetivo
Deixar as simulações de aerodinâmica mais didáticas ao mostrar claramente o ângulo crítico de 15° e como a separação do fluxo avança do bordo de fuga para o bordo de ataque.

## Alterações
- Exibir o ângulo crítico de 15° junto ao controle de ângulo de ataque.
- Mostrar estados claros: fluxo aderido, separação inicial, próximo do ângulo crítico e estol.
- Fazer as partículas se desprenderem primeiro na parte traseira da asa e avançarem para a frente conforme o ângulo aumenta.
- Destacar visualmente o ponto de separação e a queda de sustentação após 15°.
- Ajustar o texto da aula para explicar a progressão descrita, mantendo o aviso de modelo didático simplificado.
- Validar as simulações em tela grande e pequena.

## Detalhes técnicos
- Centralizar o valor de 15° em uma constante compartilhada pelos cálculos e simulações.
- Atualizar `AirfoilLab` e `StallSim` sem alterar os demais módulos do aplicativo.
