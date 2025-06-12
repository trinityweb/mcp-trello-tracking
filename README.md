# MCP Trello Tracking

MCP Server para gestión y tracking de proyectos usando Trello API. Permite integrar funcionalidades de Trello directamente en tu flujo de trabajo de desarrollo.

## Características

- 🎯 Gestión de tableros y listas de Trello
- 📋 Creación y actualización de tarjetas
- 🏷️ Manejo de etiquetas y miembros
- 📊 Tracking de progreso de proyectos
- 🔄 Sincronización bidireccional
- 📈 Reportes y métricas de productividad

## Instalación

```bash
npm install
```

## Configuración

1. Crea un archivo de configuración con tus credenciales de Trello:

```bash
cp config/trello-credentials.example.json config/trello-credentials.json
```

2. Obtén tu API Key y Token de Trello:
   - API Key: https://trello.com/app-key
   - Token: Genera un token usando tu API Key

3. Configura las credenciales en `config/trello-credentials.json`

## Uso

### Desarrollo
```bash
npm run dev
```

### Producción
```bash
npm start
```

## Funcionalidades MCP

Este servidor MCP proporciona las siguientes herramientas:

- `create_board` - Crear nuevo tablero
- `create_list` - Crear nueva lista en tablero
- `create_card` - Crear nueva tarjeta
- `update_card` - Actualizar tarjeta existente
- `move_card` - Mover tarjeta entre listas
- `add_label` - Agregar etiqueta a tarjeta
- `assign_member` - Asignar miembro a tarjeta
- `get_board_stats` - Obtener estadísticas del tablero
- `generate_report` - Generar reporte de progreso

## Estructura del Proyecto

```
src/
├── index.js          # Punto de entrada del servidor MCP
├── tools/            # Herramientas MCP
├── services/         # Servicios de Trello API
├── utils/            # Utilidades
└── config/           # Configuración
```

## Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## Licencia

MIT License - ver el archivo [LICENSE](LICENSE) para más detalles.

## Autor

SaaS-MT Team 