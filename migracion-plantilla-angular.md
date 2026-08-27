# Prompt: migración de plantilla HTML a Angular

```text
Trabaja sobre esta aplicación Angular nueva y la carpeta `plantilla/`, que contiene la plantilla HTML original:

- `plantilla/index.html` → página Home
- `plantilla/about.html` → página About
- `plantilla/shop.html` → página Menu / Shop
- `plantilla/assets/` → imágenes, fuentes, CSS, JS e iconos originales

Tu objetivo es migrar fielmente estas tres vistas a Angular y estructurarlas de forma reutilizable, sin eliminar, resumir ni omitir ninguna sección existente. La carpeta `plantilla/` debe mantenerse intacta como referencia.

Antes de modificar, ejecuta `git status`, inspecciona completamente el proyecto Angular, su versión, configuración, estilos globales y arquitectura actual. Luego revisa por completo los tres HTML y los assets para identificar elementos compartidos y exclusivos.

Implementa rutas Angular reales:

- `/` → Home
- `/about` → About
- `/menu` → Menu / Shop

Organiza el código siguiendo esta estructura —adaptándola si la arquitectura existente lo requiere—:

```text
src/app/
  components/
    header/
    footer/
    sidebar/
    mobile-menu/
    search-modal/
    preloader/
    back-to-top/
    breadcrumb/
    models/
  pages/
    home/
    about/
    menu-shop/
```

Extrae a `components/` todos los bloques reutilizables entre las vistas, tales como header, navegación desktop, navegación móvil, sidebar o panel lateral, footer, modal de búsqueda, preloader, botón “volver arriba”, breadcrumbs, submenús y cualquier otra sección repetida. No conviertas en componente elementos pequeños que solo existen una vez: déjalos en la página correspondiente cuando sea más claro.

Mantén el contenido específico de cada vista dentro de:

- `pages/home/`
- `pages/about/`
- `pages/menu-shop/`

Usa Angular de forma correcta: componentes standalone si el proyecto ya los utiliza, `routerLink` y `routerLinkActive` para navegación interna, bindings y directivas Angular para interacciones. No dejes enlaces a archivos `.html`, no recargues la página para navegar y no dupliques header, footer ni código compartido.

Migra los assets necesarios desde `plantilla/assets/` al directorio público apropiado del proyecto Angular, conservando nombres y estructura cuando sea posible. Corrige todas las rutas de imágenes, fuentes, estilos, iconos y scripts para que funcionen dentro de Angular.

Debes conservar exactamente la apariencia y estructura de la plantilla: todas las secciones, textos, imágenes, banners, cards, grids, formularios, sliders, tabs, acordeones, filtros, menús desplegables, animaciones, hover effects, responsive, sidebar, modal de búsqueda y footer. Si hay comportamientos hechos con jQuery, reemplázalos preferiblemente por Angular o TypeScript nativo, sin alterar el resultado visual o funcional.

No agregues backend, autenticación, pagos, carrito real, API ni contenido nuevo. No rediseñes la plantilla, no reemplaces sus estilos por Tailwind, Bootstrap, Angular Material u otra librería, y no elimines ninguna sección aunque parezca repetida o poco importante.

Asegura HTML semántico y accesible: imágenes con `alt`, botones reales para acciones interactivas y atributos ARIA donde aporten valor. Corrige errores de consola, rutas rotas y recursos inexistentes.

Al finalizar:

1. Ejecuta el build de producción de Angular.
2. Ejecuta las pruebas existentes, si las hay.
3. Verifica que `/`, `/about` y `/menu` funcionen.
4. Verifica que no haya assets faltantes ni errores en consola.
5. Comprueba explícitamente que ninguna sección de `index.html`, `about.html` o `shop.html` haya sido omitida.
6. Entrega un resumen con componentes creados, páginas creadas, rutas configuradas, assets migrados, interacciones implementadas o adaptadas, resultado del build/pruebas y cualquier limitación real encontrada.

No hagas commits, no borres archivos y no modifiques la carpeta original `plantilla/`.
```
