# BrainDump

Gestión de ideas y notas personales construida sobre **Clean Architecture**, **TypeScript estricto** y **Node.js**.

---


## Estructura del Proyecto

```
braindump/
├── src/
│   ├── domain/                     
│   │   ├── entities/
│   │   │   ├── Note.ts             
│   │   │   └── Note.test.ts        
│   │   ├── ports/
│   │   │   └── INoteRepository.ts  
│   │   └── value-objects/          
│   │
│   ├── application/                
│   │   └── use-cases/
│   │       ├── CreateNoteUseCase.ts       
│   │       ├── CreateNoteUseCase.test.ts  
│   │       └── GetNoteByIdUseCase.ts      
│   │
│   ├── infrastructure/             
│   │   ├── repositories/
│   │   │   └── InMemoryNoteRepository.ts  
│   │   └── http/                   
│   │
│   └── index.ts                    
│
├── package.json
├── tsconfig.json
├── vitest.config.ts
└── README.md

┌──────────────────────────────────────────────┐
│              Infrastructure                  │  ← Frameworks, BDs, APIs, HTTP
│  ┌────────────────────────────────────────┐  │
│  │            Application                 │  │  ← Casos de Uso, Orquestación
│  │  ┌──────────────────────────────────┐  │  │
│  │  │            Domain                │  │  │  ← Entidades, Puertos (contratos)
│  │  └──────────────────────────────────┘  │  │
│  └────────────────────────────────────────┘  │
└──────────────────────────────────────────────┘

```



## Stack Tecnológico

| Herramienta | Propósito |
|---|---|
| TypeScript `strict` | Seguridad de tipos en toda la codebase |
| Node.js | Runtime |
| Vitest | Tests unitarios y de integración |
| tsx | Ejecución directa de TypeScript en desarrollo |

---

## Comandos

```bash
# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev

# Compilar a JavaScript
npm run build

# Ejecutar tests en modo watch
npm test

# Ejecutar tests una sola vez
npm run test:run

# Generar reporte de cobertura
npm run test:coverage
```

---


