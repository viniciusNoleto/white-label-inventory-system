'use client';

import { useMutation, useQuery } from '@tanstack/react-query';
import { notifications } from '@mantine/notifications';
import * as yup from 'yup';
import { useState } from 'react';
import { Form } from '@/src/components/form/Form';
import { FormButton } from '@/src/components/form/Button';
import { FormTextInput } from '@/src/components/form/TextInput';
import { FormSelect } from '@/src/components/form/Select';
import { FormNumberInput } from '@/src/components/form/Number';
import { FormMultiSelect } from '@/src/components/form/MultiSelect';
import { useValidatedFormState } from '@/src/utils/state';
import { createInventoryItemService } from '../services/createInventoryItem';
import { getUnitsService, GET_UNITS_KEY } from '@/src/resources/unit/services/getUnits';
import { getItemCategoriesService, GET_ITEM_CATEGORIES_KEY } from '@/src/resources/item-category/services/getItemCategories';
import { getInventoryItemsService, GET_INVENTORY_ITEMS_KEY } from '../services/getInventoryItems';
import { UtilsFor } from '@/src/components/utils/For';
import { Icon } from '@iconify/react';
import { ActionIcon, NumberInput } from '@mantine/core';

const createInventoryItemSchema = yup.object({
  name: yup.string().default('').required('Nome é obrigatório').max(255),
  unit_id: yup.string().required('Unidade é obrigatória'),
  quantity: yup.number().default(0).min(0),
  category_ids: yup.array().of(yup.string()).default([]),
});

type ComponentEntry = {
  id: string;
  name: string;
  quantity_required: number;
};

export function useCreateInventoryItemLogicData({ onSuccess }: { onSuccess: () => void }) {
  const createInventoryItemValidatedFormState = useValidatedFormState(createInventoryItemSchema);
  const [components, setComponents] = useState<ComponentEntry[]>([]);

  const createInventoryItemMutation = useMutation({
    mutationFn: () => {
      const { name, unit_id, quantity, category_ids } = createInventoryItemValidatedFormState.state;
      return createInventoryItemService({
        body: {
          name,
          unit_id,
          quantity,
          category_ids: category_ids?.filter(Boolean) as string[],
          components: components.map(c => ({ id: c.id, quantity_required: c.quantity_required })),
        },
      });
    },
    onSuccess: (res) => {
      notifications.show({ message: res.message, color: 'green' });
      onSuccess();
    },
    onError: (err: any) => {
      notifications.show({
        title: 'Erro',
        message: err?.message ?? 'Não foi possível criar o item. Tente novamente.',
        color: 'red',
      });
    },
  });

  function createInventoryItemReset() {
    createInventoryItemValidatedFormState.setState(createInventoryItemSchema.getDefault() as any);
    createInventoryItemValidatedFormState.setErrors({});
    setComponents([]);
  }

  return {
    createInventoryItemValidatedFormState,
    createInventoryItemMutation,
    createInventoryItemReset,
    components,
    setComponents,
  };
}

export function CreateInventoryItemLogicComponent({
  logicData,
  onCancel,
}: {
  logicData: ReturnType<typeof useCreateInventoryItemLogicData>;
  onCancel: () => void;
}) {
  const {
    createInventoryItemValidatedFormState: {
      field: itemField,
      validate: validateItem,
      setValue: setItemValue,
    },
    createInventoryItemMutation: { mutate: createInventoryItem, isLoading: createInventoryItemIsPending },
    components,
    setComponents,
  } = logicData;

  const [selectedComponentId, setSelectedComponentId] = useState<string | null>(null);
  const [componentQty, setComponentQty] = useState<number>(1);

  const { data: unitsData } = useQuery({
    queryKey: GET_UNITS_KEY,
    queryFn: ({ signal }) => getUnitsService({ signal }),
  });

  const { data: categoriesData } = useQuery({
    queryKey: GET_ITEM_CATEGORIES_KEY,
    queryFn: ({ signal }) => getItemCategoriesService({ signal }),
  });

  const { data: allItemsData } = useQuery({
    queryKey: GET_INVENTORY_ITEMS_KEY,
    queryFn: ({ signal }) => getInventoryItemsService({ signal }),
  });

  const units = unitsData?.data ?? [];
  const categories = categoriesData?.data ?? [];
  const allItems = allItemsData?.data?.items ?? [];

  const availableComponentItems = allItems.filter(
    item => !components.some(c => c.id === String(item.id))
  );

  function addComponent() {
    if (!selectedComponentId) return;
    const item = allItems.find(i => String(i.id) === selectedComponentId);
    if (!item) return;
    setComponents(prev => [...prev, { id: String(item.id), name: item.name, quantity_required: componentQty }]);
    setSelectedComponentId(null);
    setComponentQty(1);
  }

  function removeComponent(id: string) {
    setComponents(prev => prev.filter(c => c.id !== id));
  }

  function updateComponentQty(id: string, qty: number) {
    setComponents(prev => prev.map(c => c.id === id ? { ...c, quantity_required: qty } : c));
  }

  async function submit() {
    if (!await validateItem()) return;
    createInventoryItem();
  }

  return (
    <Form
      onSubmit={submit}
      className="flex flex-col gap-4"
    >
      <FormTextInput
        label="Nome"
        placeholder="Ex: Parafuso M6"
        required
        {...itemField('name')}
      />

      <div className="grid grid-cols-2 gap-4">
        <FormSelect
          label="Unidade"
          placeholder="Selecione"
          data={units}
          valueField="id"
          labelField="name"
          required
          {...itemField('unit_id')}
        />

        <FormNumberInput
          label="Quantidade inicial"
          placeholder="0"
          min={0}
          {...itemField('quantity')}
        />
      </div>

      <FormMultiSelect
        label="Categorias"
        placeholder="Selecione as categorias"
        data={categories}
        valueField="id"
        labelField="name"
        value={(itemField('category_ids').value ?? []) as string[]}
        onChange={(v) => setItemValue('category_ids', v as any)}
      />

      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium text-gray-700">
          Componentes
        </span>

        <div className="flex gap-2 items-end">
          <FormSelect
            placeholder="Selecionar item como componente"
            data={availableComponentItems}
            valueField="id"
            labelField="name"
            value={selectedComponentId}
            onChange={(v) => setSelectedComponentId(v)}
            className="flex-1"
          />

          <NumberInput
            placeholder="Qtd."
            min={0.0001}
            step={1}
            value={componentQty}
            onChange={(v) => setComponentQty(Number(v))}
            className="w-24"
          />

          <ActionIcon
            variant="filled"
            color="primary"
            size="lg"
            onClick={addComponent}
            disabled={!selectedComponentId}
          >
            <Icon
              icon="lucide:plus"
              className="w-4 h-4"
            />
          </ActionIcon>
        </div>

        <UtilsFor
          each={components}
          eachKey={({ item }) => item.id}
          empty={
            <p className="text-xs text-gray-400 py-1">
              Nenhum componente adicionado.
            </p>
          }
        >
          {({ item: comp }) => (
            <div className="flex items-center gap-2 p-2 bg-gray-50 rounded text-sm">
              <span className="flex-1 text-gray-700">
                {comp.name}
              </span>

              <NumberInput
                size="xs"
                min={0.0001}
                step={1}
                value={comp.quantity_required}
                onChange={(v) => updateComponentQty(comp.id, Number(v))}
                className="w-24"
              />

              <ActionIcon
                variant="subtle"
                color="red"
                size="sm"
                onClick={() => removeComponent(comp.id)}
              >
                <Icon
                  icon="lucide:x"
                  className="w-3 h-3"
                />
              </ActionIcon>
            </div>
          )}
        </UtilsFor>
      </div>

      <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
        <FormButton
          variant="subtle"
          color="gray"
          onClick={onCancel}
          disabled={createInventoryItemIsPending}
        >
          Cancelar
        </FormButton>

        <FormButton
          type="submit"
          color="primary"
          loading={createInventoryItemIsPending}
        >
          Salvar
        </FormButton>
      </div>
    </Form>
  );
}
