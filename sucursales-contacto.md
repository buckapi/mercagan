# Sucursales y contacto de Mercagán

Este documento resume la información centralizada en `src/app/data/branches.json`.

## Fuente de datos

Cada sede utiliza los siguientes campos:

- `id`: identificador estable de la sucursal.
- `name`: nombre de la sede.
- `department`, `region` y `city`: jerarquía geográfica canónica `department → region → city → branch`.
- `group`: agrupación visual heredada para mantener compatibles los selectores existentes.
- `address`: dirección cuando fue suministrada.
- `phones`: teléfonos sin formato, usados para generar enlaces `tel:+57...`.
- `whatsApp`: número explícito de WhatsApp cuando existe.
- `latitude` y `longitude`: coordenadas usadas para elegir la sede cercana desde el menú.

Los teléfonos se muestran con espacios, por ejemplo `300 648 1354`, y sus enlaces se generan con el prefijo colombiano `+57`.

## Bucaramanga y área metropolitana

Todas estas sedes pertenecen al departamento de Santander y a la región Área Metropolitana de Bucaramanga. Las ciudades se conservan de manera precisa: Bucaramanga, Floridablanca y Piedecuesta son municipios distintos.

### Mercagán Carrera 33

- Dirección: Cra. 33 #42-12, Bucaramanga, Santander, Colombia.
- Teléfonos: 300 648 1354, 314 677 9112, 315 512 1167, 607 696 0893, 607 696 0908, 607 697 7938, 607 698 9912, 607 632 4959.

### Mercagán San Pío

- Dirección: Cra. 34 #44-84, Bucaramanga, Santander, Colombia.
- Teléfonos: 300 537 0940, 316 469 1142, 322 792 4205, 607 681 2476, 607 681 2724.

### Mercagán Megamall

- Dirección: Cra. 33A #29-15, local 46, Bucaramanga, Santander, Colombia.
- Teléfonos: 314 380 8822, 607 676 6829.

### Mercagán Cabecera - Cuarta Etapa

- Dirección: Cra. 35A #49-55, Bucaramanga, Santander, Colombia.
- Teléfonos: 322 637 4269, 315 266 1598, 607 672 1848.

### Mercagán C.C. Cacique

- Dirección: Transversal 93 #34-99, Bucaramanga, Santander, Colombia.
- Teléfonos: 607 685 8242, 607 685 9628, 301 217 1112.

### Mercagán Cañaveral - Carrera 26

- Dirección: Cra. 26 #30-92, Floridablanca, Santander, Colombia.
- Teléfonos: 318 365 9692, 318 365 9696, 607 619 0303, 607 618 4999.

### Mercagán C.C. Cañaveral Express

- Dirección: Calle 30 #25-71, Floridablanca, Santander, Colombia.
- Teléfonos: 315 080 9393, 305 310 9090, 607 685 3334.

### Mercagán C.C. De La Cuesta

- Dirección: Cra. 15 #3AN-10, Piedecuesta, Santander, Colombia.
- Teléfonos: 315 860 0270, 607 690 9640, 310 344 4716.

### Mercagán C.C. Acrópolis

- Dirección: Av. Samanes #9-140, Bucaramanga, Santander, Colombia.
- Teléfonos: 607 682 0028, 312 473 9620.

## Santander

Estas sedes pertenecen al departamento de Santander, pero no a la región Área Metropolitana de Bucaramanga.

### Mercagán C.C. El Puente - San Gil

- Dirección: Calle 10 #12-184, local 105A, San Gil, Santander, Colombia.
- Teléfono: 607 723 7070.

### Mercagán Panachi

- Dirección: no suministrada.
- Teléfono: 318 365 9701.

## Bogotá

Estas sedes pertenecen al departamento Bogotá D.C., región Bogotá y ciudad Bogotá.

### Mercagán C.C. El Edén

- Dirección: Cra. 72 #15-98, local 113B, Bogotá, Colombia.
- WhatsApp y teléfono: 321 881 0805.
- Enlace de WhatsApp: `https://wa.me/573218810805`.

### Mercagán Pepe Sierra

- Dirección: Av. Calle 116 #18-24, Bogotá, Colombia.
- Teléfono: 314 297 9878.

### Mercagán Zona G

- Dirección: Calle 69A #6-19, Bogotá, Colombia.
- Teléfono: 310 369 2088.

## Comportamiento en el sitio

- La sede activa se administra mediante `BranchService`.
- La selección se persiste en `localStorage` con la clave `mercagan-selected-branch`.
- Footer, panel de sucursales, checkout, menú del header, selector de ubicaciones y botones de contacto consultan la sede activa.
- El primer número móvil disponible se utiliza como teléfono principal. Cuando una sede dispone de móvil, el sitio puede generar su enlace de WhatsApp; El Edén usa explícitamente el número oficial configurado.
- Los catálogos de productos y categorías también se relacionan con la sede mediante `branchId`.
- `BranchService` ofrece `branchesByDepartment`, `branchesByRegion` y `branchesByCity` para filtros, mapas, SEO o selectores detallados sin duplicar la lógica geográfica.
