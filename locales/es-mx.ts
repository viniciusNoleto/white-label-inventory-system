import type enUs from './en-us'

export default {
  language: {
    label: 'Idioma',
    'pt-br': 'Português (Brasil)',
    'es-mx': 'Español (México)',
    'en-us': 'English (US)',
  },

  common: {
    actions: {
      save: 'Guardar',
      cancel: 'Cancelar',
      close: 'Cerrar',
    },
    table: {
      emptyDefault: 'No se encontraron datos',
      actionsColumn: 'Acciones',
    },
    notifications: {
      errorTitle: 'Error',
    },
  },

  errorBoundary: {
    title: 'Algo salió mal.',
    description: 'Recarga la página o ponte en contacto con soporte.',
  },

  home: {
    subtitle: 'Sistema genérico de control de existencias e inventario',
    description: 'Gestiona tu inventario de forma simple y eficiente. Registra artículos, organízalos por categorías, controla cantidades y construye productos compuestos a partir de sus componentes, todo en un solo lugar.',
    ctaPrimary: 'Ir al Inventario',
    ctaSecondary: 'Saber más',
    features: {
      categories: {
        title: 'Categorías',
        description: 'Organiza tus artículos en categorías con colores personalizados.',
      },
      stock: {
        title: 'Control de existencias',
        description: 'Edita cantidades directamente en la tabla con precisión decimal.',
      },
      build: {
        title: 'Construcción',
        description: 'Construye artículos compuestos consumiendo sus componentes automáticamente.',
      },
    },
  },

  inventory: {
    page: {
      title: 'Inventario',
      subtitle: 'Gestiona tus artículos de existencias',
    },
    actions: {
      newUnit: 'Nueva Unidad',
      newCategory: 'Nueva Categoría',
      newItem: 'Nuevo Artículo',
    },
    search: {
      placeholder: 'Buscar por nombre...',
    },
    table: {
      columns: {
        name: 'Nombre',
        categories: 'Categorías',
        quantity: 'Cantidad',
        unit: 'Unidad',
      },
      empty: 'No se encontraron artículos. Crea el primero haciendo clic en \'Nuevo Artículo\'.',
    },
    rowActions: {
      editQuantity: 'Editar cantidad',
      build: 'Construir',
    },
    modals: {
      createUnit: 'Nueva Unidad',
      createCategory: 'Nueva Categoría',
      createItem: 'Nuevo Artículo de Inventario',
      updateQuantity: 'Editar Cantidad',
      build: 'Construir: {{name}}',
    },
  },

  forms: {
    unit: {
      name: {
        label: 'Nombre',
        placeholder: 'Ej: Kilogramo',
      },
      abbreviation: {
        label: 'Abreviatura',
        placeholder: 'Ej: kg',
      },
      validation: {
        nameRequired: 'El nombre es obligatorio',
        abbreviationRequired: 'La abreviatura es obligatoria',
      },
    },

    category: {
      name: {
        label: 'Nombre',
        placeholder: 'Ej: Materia Prima',
      },
      color: {
        label: 'Color',
        placeholder: '#6F1FF9',
      },
      validation: {
        nameRequired: 'El nombre es obligatorio',
        colorRequired: 'El color es obligatorio',
      },
    },

    inventoryItem: {
      name: {
        label: 'Nombre',
        placeholder: 'Ej: Tornillo M6',
      },
      unit: {
        label: 'Unidad',
        placeholder: 'Seleccionar',
      },
      quantity: {
        label: 'Cantidad inicial',
        placeholder: '0',
      },
      categories: {
        label: 'Categorías',
        placeholder: 'Seleccionar categorías',
      },
      components: {
        label: 'Componentes',
        selectPlaceholder: 'Seleccionar artículo como componente',
        qtyPlaceholder: 'Cant.',
        empty: 'No se agregaron componentes.',
      },
      validation: {
        nameRequired: 'El nombre es obligatorio',
        unitRequired: 'La unidad es obligatoria',
      },
    },

    updateQuantity: {
      description: 'Define la nueva cantidad para "{{name}}".',
      mode: {
        set: 'Establecer valor',
        add: 'Sumar',
        subtract: 'Restar',
      },
      quantity: {
        label: 'Nueva cantidad',
      },
      amount: {
        label: 'Valor',
      },
      preview: 'Nueva cantidad: {{count}}',
      validation: {
        required: 'La cantidad es obligatoria',
        min: 'La cantidad no puede ser negativa',
      },
    },

    build: {
      noComponentsMessage: 'Este artículo no tiene componentes registrados. Agrega componentes al crear o editar el artículo.',
      requiredComponentsLabel: 'Componentes necesarios por unidad',
      requiredLabel: 'Necesario: {{count}}',
      availableLabel: 'Disponible: {{count}}',
      maxPossibleLabel: 'Máx. posible: {{count}}',
      quantity: {
        label: 'Cantidad a construir',
        placeholder: '1',
      },
      submit: 'Construir',
      validation: {
        required: 'La cantidad es obligatoria',
        min: 'Mínimo de 1 unidad',
      },
    },
  },

  notifications: {
    errors: {
      createUnit: 'No se pudo crear la unidad. Inténtalo de nuevo.',
      createCategory: 'No se pudo crear la categoría. Inténtalo de nuevo.',
      createItem: 'No se pudo crear el artículo. Inténtalo de nuevo.',
      updateQuantity: 'No se pudo actualizar la cantidad.',
      build: 'No se pudo construir el artículo.',
    },
  },
} as typeof enUs;
