# Master Prompt

Empieza a trabajar en la tarea que te indique dentro de este proyecto siguiendo estrictamente `AGENTS.md`.

Contexto obligatorio:

- El proyecto debe construirse solo con HTML, CSS y JavaScript nativos.
- No se permiten librerías ni frameworks externos.
- Toda la interfaz debe ser responsive y funcionar correctamente en pantallas grandes, tablet y móvil.
- La arquitectura debe ser modular, con filosofía de componentes pequeños e independientes, estilo Angular, pero implementada con APIs nativas.
- Cada componente debe tener su propia separación de responsabilidades y, cuando aplique, su HTML, CSS y JS.
- Incluso elementos pequeños como inputs, textareas y botones deben tratarse como componentes reutilizables.
- Los controles de formulario deben heredar de una clase base común para compartir estilos, propiedades y comportamiento.
- La reactividad debe implementarse con eventos nativos y una arquitectura orientada a eventos, sin dependencias externas.
- El HTML debe seguir buenas prácticas de HTML5, estar limpio y bien formateado.
- En CSS y en la selección de elementos, prioriza clases descriptivas antes que IDs.
- El JavaScript debe ser claro, modular, documentado y, cuando sea posible, sin punto y coma.
- El diseño visual debe ser moderno, brutalista, sin sombras, con bordes duros y colores pastel.

Objetivo del producto:

- La aplicación es un gestor de tareas tipo kanban.
- Debe tener las columnas `planificada`, `en desarrollo` y `completada`.
- Las tareas deben persistirse en IndexedDB.
- IndexedDB debe actualizarse cada vez que una tarea se crea, modifica, mueve o elimina.
- La creación de tareas y la vista de detalle deben hacerse con `dialog`.
- Cada tarea debe guardar fecha de creación, fecha de inicio de desarrollo, tiempo transcurrido y fecha de finalización.
- Mientras una tarea esté en `en desarrollo`, su tiempo debe actualizarse cada segundo.

Reglas de ejecución:

1. Antes de implementar, revisa la estructura actual del proyecto y trabaja sobre ella sin romper la arquitectura definida.
2. Implementa la tarea de forma incremental y mantén los componentes pequeños y reutilizables.
3. Cada vez que completes un componente, crea o actualiza su test nativo en JavaScript dentro de `test/`, replicando la estructura del proyecto y manteniendo un test por componente.
4. Si la carpeta `test/` o sus subcarpetas no existen, créalas.
5. Al final de cada iteración, ejecuta las skills aplicables.
6. Al final de cada iteración, aplica también el flujo de git definido: revisar cambios, preparar solo archivos seguros y relacionados, hacer un commit descriptivo y hacer push si procede.
7. Nunca añadas a git entornos virtuales, `.env`, cachés, builds, credenciales ni archivos locales no deseados.
8. Si hay varias formas de implementar algo, elige la opción más simple, nativa, mantenible y consistente con `AGENTS.md`.

Formato de trabajo esperado:

- Empieza por la parte prioritaria que te indique.
- Si falta estructura base, créala.
- Si falta un componente base necesario, créalo antes que los componentes dependientes.
- Si completas una iteración, deja el código, el test y el estado del repositorio en orden.

Plantilla de uso:

`Empieza a trabajar en [tarea concreta]. Prioriza [bloque o componente]. Sigue AGENTS.md y ejecuta las skills aplicables al final de cada iteración.`
