# Mercagán — Propuesta de Rediseño Web

Propuesta de rediseño y modernización del sitio web de **Mercagán**, enfocada en mejorar la presentación visual de la marca, la experiencia de navegación y la exposición de su oferta gastronómica, manteniendo una identidad cercana, apetecible y orientada a conversión.

> Este repositorio corresponde a una propuesta de desarrollo/rediseño y no representa necesariamente el sitio oficial actualmente publicado por Mercagán.

## Objetivo

El proyecto busca construir una experiencia digital moderna para Mercagán que permita:

- Presentar la marca y su propuesta gastronómica de forma atractiva.
- Destacar hamburguesas, carnes, parrilla y demás productos principales.
- Facilitar la consulta del menú.
- Mostrar las diferentes sedes y puntos de atención.
- Mejorar la navegación desde dispositivos móviles.
- Facilitar el contacto y acceso a canales de atención.
- Preparar la base para futuras integraciones, promociones y funcionalidades interactivas.

## Características

- Diseño responsive para desktop, tablet y móvil.
- Página de inicio orientada a producto y marca.
- Secciones promocionales y banners visuales.
- Presentación de productos destacados.
- Menú gastronómico.
- Información de sucursales.
- Navegación reutilizable entre páginas.
- Formularios y llamados a la acción.
- Integración con redes sociales y canales externos.
- Assets optimizados para fotografías de producto.
- Estructura preparada para SEO básico y mejoras posteriores.

## Estructura del proyecto

```text
mercagan/
├── assets/
│   ├── css/
│   ├── fonts/
│   ├── images/
│   └── js/
├── index.html
├── about.html
├── menu.html
├── contact.html
└── README.md
```

> La estructura puede variar a medida que avance el desarrollo.

## Tecnologías

La propuesta está construida principalmente con tecnologías web estándar:

- HTML5
- CSS3
- JavaScript
- Bootstrap
- Librerías y componentes visuales incluidos en la plantilla base

## Enfoque de diseño

La interfaz busca conservar el carácter visual de Mercagán mediante:

- Fotografías de producto de alto impacto.
- Composiciones con hamburguesas, carnes y platos de parrilla.
- Jerarquía visual clara.
- Uso controlado de elementos gráficos y animaciones.
- Navegación sencilla y orientada a acciones.
- Experiencia consistente entre escritorio y dispositivos móviles.

## Sucursales

El proyecto contempla una sección para organizar los diferentes puntos de atención de Mercagán y facilitar su consulta por ubicación.

La información de cada sede puede incluir:

- Nombre de la sede.
- Ciudad o zona.
- Dirección.
- Horarios.
- Teléfono.
- Enlace a Google Maps.
- Acceso a WhatsApp cuando aplique.

## Desarrollo local

Al tratarse de un proyecto basado en archivos web estáticos, puede ejecutarse directamente desde un servidor local.

Por ejemplo:

```bash
python3 -m http.server 8080
```

Luego abre:

```text
http://localhost:8080
```

También puede utilizarse cualquier servidor de desarrollo como Live Server.

## Buenas prácticas del repositorio

Antes de realizar cambios:

1. No eliminar secciones existentes sin revisar su función.
2. Mantener las animaciones y comportamientos originales cuando sea posible.
3. Optimizar las imágenes antes de incorporarlas.
4. Evitar duplicar estilos.
5. Mantener rutas relativas consistentes.
6. Verificar la experiencia responsive después de cada cambio.
7. Validar enlaces, formularios y recursos antes de publicar.

## Roadmap

Posibles siguientes etapas:

- [ ] Optimización completa para dispositivos móviles.
- [ ] Mejoras de rendimiento y Core Web Vitals.
- [ ] SEO técnico y datos estructurados.
- [ ] Integración con Google Maps.
- [ ] Integración con WhatsApp.
- [ ] Menú dinámico.
- [ ] Sistema de promociones.
- [ ] Sección interactiva “Arma tu hamburguesa”.
- [ ] Integración con pedidos o plataformas de delivery.
- [ ] Analítica de comportamiento y conversiones.

## Estado

**En desarrollo — propuesta de rediseño web.**

El contenido, recursos gráficos, fotografías, precios, promociones, ubicaciones y demás información comercial deberán verificarse antes de una publicación en producción.

## Autor

Desarrollo y propuesta técnica por **Buckapi**.

---

Este repositorio se utiliza para gestionar el código fuente, recursos y evolución de la propuesta de rediseño de Mercagán.
