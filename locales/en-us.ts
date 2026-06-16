export default {
  language: {
    label: 'Language',
    'pt-br': 'Português (Brasil)',
    'es-mx': 'Español (México)',
    'en-us': 'English (US)',
  },

  common: {
    actions: {
      save: 'Save',
      cancel: 'Cancel',
      close: 'Close',
    },
    table: {
      emptyDefault: 'No data found',
      actionsColumn: 'Actions',
    },
    notifications: {
      errorTitle: 'Error',
    },
  },

  errorBoundary: {
    title: 'Something went wrong.',
    description: 'Reload the page or contact support.',
  },

  home: {
    subtitle: 'Generic stock and inventory control system',
    description: 'Manage your inventory simply and efficiently. Register items, organize them by category, control quantities and build composite products from their components — all in one place.',
    ctaPrimary: 'Go to Inventory',
    ctaSecondary: 'Learn more',
    features: {
      categories: {
        title: 'Categories',
        description: 'Organize your items into categories with custom colors.',
      },
      stock: {
        title: 'Stock control',
        description: 'Edit quantities directly in the table with decimal precision.',
      },
      build: {
        title: 'Build',
        description: 'Build composite items, automatically consuming their components.',
      },
    },
  },

  inventory: {
    page: {
      title: 'Inventory',
      subtitle: 'Manage your stock items',
    },
    actions: {
      newUnit: 'New Unit',
      newCategory: 'New Category',
      newItem: 'New Item',
    },
    search: {
      placeholder: 'Search by name...',
    },
    table: {
      columns: {
        name: 'Name',
        categories: 'Categories',
        quantity: 'Quantity',
        unit: 'Unit',
      },
      empty: 'No items found. Create the first one by clicking \'New Item\'.',
    },
    rowActions: {
      editQuantity: 'Edit quantity',
      build: 'Build',
    },
    modals: {
      createUnit: 'New Unit',
      createCategory: 'New Category',
      createItem: 'New Inventory Item',
      updateQuantity: 'Edit Quantity',
      build: 'Build: {{name}}',
    },
  },

  forms: {
    unit: {
      name: {
        label: 'Name',
        placeholder: 'E.g.: Kilogram',
      },
      abbreviation: {
        label: 'Abbreviation',
        placeholder: 'E.g.: kg',
      },
      validation: {
        nameRequired: 'Name is required',
        abbreviationRequired: 'Abbreviation is required',
      },
    },

    category: {
      name: {
        label: 'Name',
        placeholder: 'E.g.: Raw Material',
      },
      color: {
        label: 'Color',
        placeholder: '#6F1FF9',
      },
      validation: {
        nameRequired: 'Name is required',
        colorRequired: 'Color is required',
      },
    },

    inventoryItem: {
      name: {
        label: 'Name',
        placeholder: 'E.g.: M6 Screw',
      },
      unit: {
        label: 'Unit',
        placeholder: 'Select',
      },
      quantity: {
        label: 'Initial quantity',
        placeholder: '0',
      },
      categories: {
        label: 'Categories',
        placeholder: 'Select categories',
      },
      components: {
        label: 'Components',
        selectPlaceholder: 'Select item as component',
        qtyPlaceholder: 'Qty.',
        empty: 'No components added.',
      },
      validation: {
        nameRequired: 'Name is required',
        unitRequired: 'Unit is required',
      },
    },

    updateQuantity: {
      description: 'Set the new quantity for "{{name}}".',
      mode: {
        set: 'Set value',
        add: 'Add',
        subtract: 'Subtract',
      },
      quantity: {
        label: 'New quantity',
      },
      amount: {
        label: 'Amount',
      },
      preview: 'New quantity: {{count}}',
      validation: {
        required: 'Quantity is required',
        min: 'Quantity cannot be negative',
      },
    },

    build: {
      noComponentsMessage: 'This item has no registered components. Add components when creating or editing the item.',
      requiredComponentsLabel: 'Components required per unit',
      requiredLabel: 'Required: {{count}}',
      availableLabel: 'Available: {{count}}',
      maxPossibleLabel: 'Max. possible: {{count}}',
      quantity: {
        label: 'Quantity to build',
        placeholder: '1',
      },
      submit: 'Build',
      validation: {
        required: 'Quantity is required',
        min: 'Minimum of 1 unit',
      },
    },
  },

  notifications: {
    errors: {
      createUnit: 'Could not create the unit. Please try again.',
      createCategory: 'Could not create the category. Please try again.',
      createItem: 'Could not create the item. Please try again.',
      updateQuantity: 'Could not update the quantity.',
      build: 'Could not build the item.',
    },
  },
};
