1. [ ] # Sucursales y contacto de Mercagán
2. [ ] 
3. [ ] Este documento resume la información centralizada en `src/app/data/branches.json`.
4. [ ] 
5. [ ] ## Fuente de datos
6. [ ] 
7. [ ] Cada sede utiliza los siguientes campos:
8. [ ] 
9. [ ] - `id`: identificador estable de la sucursal.
10. [ ] - `name`: nombre de la sede.
11. [ ] - `department`, `region` y `city`: jerarquía geográfica canónica `department → region → city → branch`.
12. [ ] - `group`: agrupación visual heredada para mantener compatibles los selectores existentes.
13. [ ] - `address`: dirección cuando fue suministrada.
14. [ ] - `phones`: teléfonos sin formato, usados para generar enlaces `tel:+57...`.
15. [ ] - `whatsApp`: número explícito de WhatsApp cuando existe.
16. [ ] - `latitude` y `longitude`: coordenadas usadas para elegir la sede cercana desde el menú.
17. [ ] 
18. [ ] Los teléfonos se muestran con espacios, por ejemplo `300 648 1354`, y sus enlaces se generan con el prefijo colombiano `+57`.
19. [ ] 
20. [ ] ## Bucaramanga y área metropolitana
21. [ ] 
22. [ ] Todas estas sedes pertenecen al departamento de Santander y a la región Área Metropolitana de Bucaramanga. Las ciudades se conservan de manera precisa: Bucaramanga, Floridablanca y Piedecuesta son municipios distintos.
23. [ ] 
24. [ ] ### Mercagán Carrera 33
25. [ ] 
26. [ ] - Dirección: Cra. 33 #42-12, Bucaramanga, Santander, Colombia.
27. [ ] - Teléfonos: 300 648 1354, 314 677 9112, 315 512 1167, 607 696 0893, 607 696 0908, 607 697 7938, 607 698 9912, 607 632 4959.
28. [ ] 
29. [ ] ### Mercagán San Pío
30. [ ] 
31. [ ] - Dirección: Cra. 34 #44-84, Bucaramanga, Santander, Colombia.
32. [ ] - Teléfonos: 300 537 0940, 316 469 1142, 322 792 4205, 607 681 2476, 607 681 2724.
33. [ ] 
34. [ ] ### Mercagán Megamall
35. [ ] 
36. [ ] - Dirección: Cra. 33A #29-15, local 46, Bucaramanga, Santander, Colombia.
37. [ ] - Teléfonos: 314 380 8822, 607 676 6829.
38. [ ] 
39. [ ] ### Mercagán Cabecera - Cuarta Etapa
40. [ ] 
41. [ ] - Dirección: Cra. 35A #49-55, Bucaramanga, Santander, Colombia.
42. [ ] - Teléfonos: 322 637 4269, 315 266 1598, 607 672 1848.
43. [ ] 
44. [ ] ### Mercagán C.C. Cacique
45. [ ] 
46. [ ] - Dirección: Transversal 93 #34-99, Bucaramanga, Santander, Colombia.
47. [ ] - Teléfonos: 607 685 8242, 607 685 9628, 301 217 1112.
48. [ ] 
49. [ ] ### Mercagán Cañaveral - Carrera 26
50. [ ] 
51. [ ] - Dirección: Cra. 26 #30-92, Floridablanca, Santander, Colombia.
52. [ ] - Teléfonos: 318 365 9692, 318 365 9696, 607 619 0303, 607 618 4999.
53. [ ] 
54. [ ] ### Mercagán C.C. Cañaveral Express
55. [ ] 
56. [ ] - Dirección: Calle 30 #25-71, Floridablanca, Santander, Colombia.
57. [ ] - Teléfonos: 315 080 9393, 305 310 9090, 607 685 3334.
58. [ ] 
59. [ ] ### Mercagán C.C. De La Cuesta
60. [ ] 
61. [ ] - Dirección: Cra. 15 #3AN-10, Piedecuesta, Santander, Colombia.
62. [ ] - Teléfonos: 315 860 0270, 607 690 9640, 310 344 4716.
63. [ ] 
64. [ ] ### Mercagán C.C. Acrópolis
65. [ ] 
66. [ ] - Dirección: Av. Samanes #9-140, Bucaramanga, Santander, Colombia.
67. [ ] - Teléfonos: 607 682 0028, 312 473 9620.
68. [ ] 
69. [ ] ## Santander
70. [ ] 
71. [ ] Estas sedes pertenecen al departamento de Santander, pero no a la región Área Metropolitana de Bucaramanga.
72. [ ] 
73. [ ] ### Mercagán C.C. El Puente - San Gil
74. [ ] 
75. [ ] - Dirección: Calle 10 #12-184, local 105A, San Gil, Santander, Colombia.
76. [ ] - Teléfono: 607 723 7070.
77. [ ] 
78. [ ] ### Mercagán Panachi
79. [ ] 
80. [ ] - Dirección: no suministrada.
81. [ ] - Teléfono: 318 365 9701.
82. [ ] 
83. [ ] ## Bogotá
84. [ ] 
85. [ ] Estas sedes pertenecen al departamento Bogotá D.C., región Bogotá y ciudad Bogotá.
86. [ ] 
87. [ ] ### Mercagán C.C. El Edén
88. [ ] 
89. [ ] - Dirección: Cra. 72 #15-98, local 113B, Bogotá, Colombia.
90. [ ] - WhatsApp y teléfono: 321 881 0805.
91. [ ] - Enlace de WhatsApp: `https://wa.me/573218810805`.
92. [ ] 
93. [ ] ### Mercagán Pepe Sierra
94. [ ] 
95. [ ] - Dirección: Av. Calle 116 #18-24, Bogotá, Colombia.
96. [ ] - Teléfono: 314 297 9878.
97. [ ] 
98. [ ] ### Mercagán Zona G
99. [ ] 
100. [ ] - Dirección: Calle 69A #6-19, Bogotá, Colombia.
101. [ ] - Teléfono: 310 369 2088.
102. [ ] 
103. [ ] ## Comportamiento en el sitio
104. [ ] 
105. [ ] - La sede activa se administra mediante `BranchService`.
106. [ ] - La selección se persiste en `localStorage` con la clave `mercagan-selected-branch`.
107. [ ] - Footer, panel de sucursales, checkout, menú del header, selector de ubicaciones y botones de contacto consultan la sede activa.
108. [ ] - El primer número móvil disponible se utiliza como teléfono principal. Cuando una sede dispone de móvil, el sitio puede generar su enlace de WhatsApp; El Edén usa explícitamente el número oficial configurado.
109. [ ] - Los catálogos de productos y categorías también se relacionan con la sede mediante `branchId`.
110. [ ] - `BranchService` ofrece `branchesByDepartment`, `branchesByRegion` y `branchesByCity` para filtros, mapas, SEO o selectores detallados sin duplicar la lógica geográfica.
111. [ ] 
