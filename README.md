# Salud Leon - MVP de Plataforma de Salud Municipal

Aplicacion web desarrollada con Next.js para demostrar una experiencia digital de salud publica en Leon, Guanajuato, Mexico. El proyecto centraliza informacion de campanas de salud, modulos de atencion y un expediente clinico **simulado** para fines de UX/UI, validacion funcional y presentacion de producto.

## Que es esta web

`Salud Leon` es un prototipo HealthTech tipo MVP con dos frentes:

- **Seccion publica** para ciudadanos:
  - Consulta de campanas activas.
  - Consulta de modulos de atencion por zona.
  - Noticias y contexto informativo de salud municipal.
- **Seccion privada simulada**:
  - Inicio de sesion mock (sin autenticacion real).
  - Dashboard con expediente clinico ficticio (historial, laboratorios, antecedentes).

## Para que sirve

- Validar una propuesta de experiencia digital moderna para salud municipal.
- Probar flujos de navegacion y claridad de informacion para usuarios no tecnicos.
- Mostrar una base de arquitectura Next.js lista para evolucionar a integraciones reales.
- Servir como base visual y funcional para demo, evaluacion y presentacion.

## Como funciona (resumen tecnico)

- **Frontend**: Next.js (App Router), React y Tailwind CSS.
- **Datos**: archivos JSON locales (mock).
- **APIs**: rutas `app/api/*` que devuelven datos simulados.
- **Sesion**: almacenamiento en `sessionStorage` para simular login/logout.
- **Chatbot**: asistente basado en reglas (`chatbot-rules.json`), sin IA externa.
- **Mapas**: embeds de Google Maps ya configurados para los modulos.

## Flujo principal de usuario

1. El usuario entra al inicio y explora campanas, noticias y modulos.
2. Puede abrir login para acceder al panel simulado.
3. Ingresa credenciales demo (CURP + NSS) y entra al dashboard.
4. Consulta secciones del expediente mock sin guardar datos reales.

## Alcance esperado del MVP

- Experiencia visual profesional, clara y responsive.
- Navegacion intuitiva entre secciones publicas y privadas.
- Capa SEO tecnica completa (metadata, sitemap, robots, schema basico).
- Mantener separacion clara entre demo funcional y sistema clinico real.

## Restricciones del proyecto

Para mantener consistencia del MVP:

- No modificar logica de negocio sin validacion.
- No alterar datos JSON base.
- No cambiar endpoints mock salvo requerimiento explicito.
- No convertir este prototipo en sistema medico real.

## Estructura clave

- `app/page.tsx`: landing principal.
- `app/campanas/*`: modulo de campanas.
- `app/modulos/*`: modulo de atencion y detalle por id.
- `app/login/*`: acceso simulado.
- `app/dashboard/*`: panel privado simulado.
- `app/api/*`: endpoints mock.
- `data/*.json`: fuente de datos ficticios.
- `components/*`: componentes reutilizables UI y chatbot.

## Credenciales demo

- **CURP**: `RATA980725MGTMRN07`
- **NSS**: `12345678901`

## Ejecutar localmente

```bash
npm install
npm run dev
```

Abrir en: [http://localhost:3000](http://localhost:3000)

## Scripts utiles

- `npm run dev`: entorno local.
- `npm run lint`: validacion de estilo y reglas.
- `npm run build`: compilacion de produccion.
- `npm run start`: ejecutar build en modo produccion.

## Nota importante

Este proyecto es un **prototipo demostrativo**. No almacena informacion clinica real, no reemplaza sistemas institucionales y no debe usarse como sistema medico oficial en produccion sin rediseño de seguridad, cumplimiento normativo y backend real.
# salud_leon
