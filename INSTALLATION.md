# MCP Server para Trello - Guía de Configuración

Este MCP server te permite integrar Cursor con Trello para automatizar la gestión de proyectos.

## 🚀 Instalación

### 1. Instalar dependencias

```bash
npm install
```

### 2. Obtener credenciales de Trello

1. **API Key**: Ve a https://trello.com/app-key
2. **Token**: En la misma página, genera un token usando tu API Key
3. **Board ID**:
   - **Opción 1**: Desde la URL de tu board (la parte después de `/b/`)
   - **Opción 2**: Usando la API: `https://api.trello.com/1/members/me/boards?key=TU_API_KEY&token=TU_TOKEN`

### 3. Configurar variables de entorno

```bash
cp env.example .env
# Edita .env con tus credenciales reales
```

### 4. Compilar el proyecto

```bash
npm run build
```

## 🔧 Configuración en Cursor

### Opción 1: Configuración global

Edita `~/.cursor/mcp.json` (macOS/Linux) o `%APPDATA%\Cursor\mcp.json` (Windows):

```json
{
  "mcpServers": {
    "trello": {
      "command": "node",
      "args": ["/ruta/completa/a/mcp-trello-tracking/build/index.js"],
      "env": {
        "TRELLO_API_KEY": "tu_api_key",
        "TRELLO_TOKEN": "tu_token",
        "TRELLO_BOARD_ID": "tu_board_id"
      }
    }
  }
}
```

### Opción 2: Configuración por proyecto

Crea `.cursor/mcp.json` en la raíz de tu proyecto:

```json
{
  "mcpServers": {
    "trello": {
      "command": "node",
      "args": ["../mcp-trello-tracking/build/index.js"],
      "env": {
        "TRELLO_API_KEY": "tu_api_key",
        "TRELLO_TOKEN": "tu_token",
        "TRELLO_BOARD_ID": "tu_board_id"
      }
    }
  }
}
```

## 📋 Funcionalidades disponibles

### 1. Crear tarjetas
```
"Crea una tarjeta llamada 'Implementar login' en la lista 'Por hacer' con descripción 'Agregar autenticación de usuarios'"
```

### 2. Crear épicas con sub-tareas
```
"Crea una épica llamada 'Sistema de Pagos' con subtareas: análisis, backend, frontend, testing"
```

### 3. Usar plantillas de épicas
```
"Crea una épica de tipo 'user-story' llamada 'Dashboard de Ventas'"
```

## 🎯 Plantillas de Épicas Disponibles

- **user-story**: Flujo completo de desarrollo (análisis → diseño → backend → frontend → testing → deploy)
- **feature-development**: Desarrollo de funcionalidades (investigación → prototipo → desarrollo → integración → documentación → QA)
- **bug-investigation**: Investigación y resolución de bugs (reproducir → investigar → analizar → fix → testing → deploy)
- **release-preparation**: Preparación de releases (freeze → testing → release notes → staging → validación → producción)

## 🔄 Uso automático

El MCP server puede detectar cambios en tu proyecto y actualizar Trello automáticamente:

- **Al hacer commit**: Crear tarjeta de progreso
- **Al crear feature**: Mover tarjetas relacionadas
- **Al arreglar bugs**: Actualizar tarjetas de bugs
- **Al hacer release**: Mover tarjetas a "Completado"

## 🛠️ Desarrollo

### Ejecutar en modo desarrollo
```bash
npm run dev
```

### Compilar para producción
```bash
npm run build
npm start
```

## 🔍 Solución de problemas

### Error de conexión
- Verifica que las credenciales sean correctas
- Confirma que el Board ID existe y tienes acceso

### MCP no se conecta
- Verifica que la ruta al archivo compilado sea correcta
- Revisa que Node.js esté instalado
- Comprueba que el archivo esté compilado (`npm run build`)

### Permisos de Trello
- Asegúrate de que el token tenga permisos de escritura
- Verifica que seas miembro del board

## 🚀 Siguientes pasos

1. Instala y configura el MCP server
2. Prueba con comandos básicos
3. Personaliza para tu flujo de trabajo
4. Configura automatizaciones adicionales

¡Disfruta de la productividad mejorada! 