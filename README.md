# async-context
Async wrapper that can be used with mobile-adk_context

**Contexto**

Estamos en planes de upgradear la versión de node (0.12.X) a la 4.X
En este camino, nos encontramos que cuando estamos en flujos manejados por ***async***, perdemos el contexto setteado por ***mobile-adk_context***.

Es aquí donde este modulo tiene sentido.

**Qué requiere?**

Que **TODOS** los callbacks involucrados en un flujo de async, pasen por el método ***apply*** de async.

**Qué hace?**

Básicamente, bindea con el contexto actual las llamadas a los flows, y al callback final de los métodos de async
* auto
* series

con el fin de no perder contexto.

Los invito a leer el código del módulo, y a probarlo mediante `npm run test`
