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
      save: 'Salvar',
      cancel: 'Cancelar',
      close: 'Fechar',
    },
    table: {
      emptyDefault: 'Nenhum dado encontrado',
      actionsColumn: 'Ações',
    },
    notifications: {
      errorTitle: 'Erro',
    },
  },

  errorBoundary: {
    title: 'Algo deu errado.',
    description: 'Recarregue a página ou entre em contato com o suporte.',
  },

  home: {
    subtitle: 'Sistema genérico de controle de estoque e inventário',
    description: 'Gerencie seu inventário de forma simples e eficiente. Cadastre itens, organize por categorias, controle quantidades e construa produtos compostos a partir de seus componentes — tudo em um só lugar.',
    ctaPrimary: 'Acessar Inventário',
    ctaSecondary: 'Saiba mais',
    features: {
      categories: {
        title: 'Categorias',
        description: 'Organize seus itens em categorias com cores personalizadas.',
      },
      stock: {
        title: 'Controle de estoque',
        description: 'Edite quantidades diretamente na tabela com precisão decimal.',
      },
      build: {
        title: 'Construção',
        description: 'Construa itens compostos consumindo seus componentes automaticamente.',
      },
    },
  },

  inventory: {
    page: {
      title: 'Inventário',
      subtitle: 'Gerencie seus itens de estoque',
    },
    actions: {
      newUnit: 'Nova Unidade',
      newCategory: 'Nova Categoria',
      newItem: 'Novo Item',
    },
    search: {
      placeholder: 'Buscar por nome...',
    },
    table: {
      columns: {
        name: 'Nome',
        categories: 'Categorias',
        quantity: 'Quantidade',
        unit: 'Unidade',
      },
      empty: 'Nenhum item encontrado. Crie o primeiro item clicando em \'Novo Item\'.',
    },
    rowActions: {
      editQuantity: 'Editar quantidade',
      build: 'Construir',
    },
    modals: {
      createUnit: 'Nova Unidade',
      createCategory: 'Nova Categoria',
      createItem: 'Novo Item de Inventário',
      updateQuantity: 'Editar Quantidade',
      build: 'Construir: {{name}}',
    },
  },

  forms: {
    unit: {
      name: {
        label: 'Nome',
        placeholder: 'Ex: Quilograma',
      },
      abbreviation: {
        label: 'Abreviação',
        placeholder: 'Ex: kg',
      },
      validation: {
        nameRequired: 'Nome é obrigatório',
        abbreviationRequired: 'Abreviação é obrigatória',
      },
    },

    category: {
      name: {
        label: 'Nome',
        placeholder: 'Ex: Matéria-Prima',
      },
      color: {
        label: 'Cor',
        placeholder: '#6F1FF9',
      },
      validation: {
        nameRequired: 'Nome é obrigatório',
        colorRequired: 'Cor é obrigatória',
      },
    },

    inventoryItem: {
      name: {
        label: 'Nome',
        placeholder: 'Ex: Parafuso M6',
      },
      unit: {
        label: 'Unidade',
        placeholder: 'Selecione',
      },
      quantity: {
        label: 'Quantidade inicial',
        placeholder: '0',
      },
      categories: {
        label: 'Categorias',
        placeholder: 'Selecione as categorias',
      },
      components: {
        label: 'Componentes',
        selectPlaceholder: 'Selecionar item como componente',
        qtyPlaceholder: 'Qtd.',
        empty: 'Nenhum componente adicionado.',
      },
      validation: {
        nameRequired: 'Nome é obrigatório',
        unitRequired: 'Unidade é obrigatória',
      },
    },

    updateQuantity: {
      description: 'Defina a nova quantidade para "{{name}}".',
      mode: {
        set: 'Definir valor',
        add: 'Somar',
        subtract: 'Subtrair',
      },
      quantity: {
        label: 'Nova quantidade',
      },
      amount: {
        label: 'Valor',
      },
      preview: 'Nova quantidade: {{count}}',
      validation: {
        required: 'Quantidade é obrigatória',
        min: 'Quantidade não pode ser negativa',
      },
    },

    build: {
      noComponentsMessage: 'Este item não possui componentes cadastrados. Adicione componentes ao criar ou editar o item.',
      requiredComponentsLabel: 'Componentes necessários por unidade',
      requiredLabel: 'Necessário: {{count}}',
      availableLabel: 'Disponível: {{count}}',
      maxPossibleLabel: 'Máx. possível: {{count}}',
      quantity: {
        label: 'Quantidade a construir',
        placeholder: '1',
      },
      submit: 'Construir',
      validation: {
        required: 'Quantidade é obrigatória',
        min: 'Mínimo de 1 unidade',
      },
    },
  },

  notifications: {
    errors: {
      createUnit: 'Não foi possível criar a unidade. Tente novamente.',
      createCategory: 'Não foi possível criar a categoria. Tente novamente.',
      createItem: 'Não foi possível criar o item. Tente novamente.',
      updateQuantity: 'Não foi possível atualizar a quantidade.',
      build: 'Não foi possível construir o item.',
    },
  },
} as typeof enUs;
