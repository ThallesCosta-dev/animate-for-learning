# Ângulos positivos e negativos nas simulações

## Objetivo
Permitir simular a asa inclinada nos dois sentidos: ângulo positivo com o bordo de ataque para cima e ângulo negativo com o bordo de ataque para baixo, mantendo o estol didático em +15°.

## Alterações
- Ampliar os controles de ângulo de ataque para valores negativos nas simulações aerodinâmicas.
- Ajustar sustentação, arrasto e fluxo para responderem corretamente aos ângulos negativos.
- Mostrar uma mensagem específica quando o ângulo estiver abaixo de 0°.
- Manter a separação progressiva e o estol positivo em +15°.
- Validar visualmente os dois extremos do controle.

## Detalhes técnicos
- Preservar `ANGULO_CRITICO_GRAUS` como única referência do estol didático.
- Fazer o coeficiente de sustentação diminuir e poder ficar negativo; manter o arrasto dependente da magnitude do ângulo.
- Aplicar o mesmo intervalo negativo ao laboratório, à animação de estol, ao gráfico e à comparação de perfis.
