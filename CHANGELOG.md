# Changelog

Todos los cambios notables de este proyecto serán documentados en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
y este proyecto adhiere a [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-01-12

### Agregado
- ✅ MCP Server inicial para integración con Trello
- 🎯 Sistema completo de épicas con sub-tareas
- 📋 Creación y gestión de tarjetas básicas
- 🏷️ Sistema de etiquetas automáticas para épicas y sub-tareas
- 📊 Tracking de progreso de épicas
- 🔄 Plantillas predefinidas para épicas:
  - `user-story`: Flujo completo de desarrollo
  - `feature-development`: Desarrollo de funcionalidades
  - `bug-investigation`: Investigación y resolución de bugs
  - `release-preparation`: Preparación de releases
- 🔗 Vinculación automática entre épicas y sub-tareas
- 📈 Cálculo automático de progreso basado en estados
- 🛠️ Configuración completa con TypeScript
- 📚 Documentación completa de instalación y uso
- 🔧 Archivos de configuración de ejemplo
- 🎨 Interfaz de comandos naturales para Cursor

### Características técnicas
- Arquitectura modular con TypeScript
- Integración completa con Trello API
- Manejo de errores robusto
- Configuración flexible por variables de entorno
- Compilación automática con npm scripts
- Documentación técnica completa

### Funcionalidades MCP
- `create_card`: Crear tarjetas básicas
- `create_epic`: Crear épicas con sub-tareas
- Sistema de plantillas para épicas comunes
- Etiquetado automático y organización
- Tracking de progreso en tiempo real

### Próximas versiones
- [ ] Funcionalidades adicionales de gestión de tarjetas
- [ ] Sincronización automática con Git
- [ ] Webhooks para notificaciones
- [ ] Dashboard visual de progreso
- [ ] Integración con otros sistemas de tracking 