'use client';

import { useMutation } from '@tanstack/react-query';
import { notifications } from '@mantine/notifications';
import * as yup from 'yup';
import { useMemo } from 'react';
import { Form } from '@/src/components/form/Form';
import { FormButton } from '@/src/components/form/Button';
import { FormNumberInput } from '@/src/components/form/Number';
import { useValidatedFormState } from '@/src/utils/state';
import { buildInventoryItemService } from '../services/buildInventoryItem';
import type { IInventoryItem } from '../models/InventoryItem';
import { UtilsFor } from '@/src/components/utils/For';
import { Badge } from '@mantine/core';

const buildSchema = yup.object({
  quantity: yup.number().default(1).min(1, 'Mínimo de 1 unidade').required('Quantidade é obrigatória'),
});

export function useBuildInventoryItemLogicData({
  editingItemId,
  onSuccess,
}: {
  editingItemId: string;
  onSuccess: () => void;
}) {
  const buildValidatedFormState = useValidatedFormState(buildSchema);

  const buildMutation = useMutation({
    mutationFn: () =>
      buildInventoryItemService({
        itemId: editingItemId,
        body: { quantity: buildValidatedFormState.state.quantity },
      }),
    onSuccess: (res) => {
      notifications.show({ message: res.message, color: 'green' });
      onSuccess();
    },
    onError: (err: any) => {
      notifications.show({
        title: 'Erro',
        message: err?.message ?? 'Não foi possível construir o item.',
        color: 'red',
      });
    },
  });

  function buildReset() {
    buildValidatedFormState.setState(buildSchema.getDefault());
    buildValidatedFormState.setErrors({});
  }

  return { buildValidatedFormState, buildMutation, buildReset };
}

export function BuildInventoryItemLogicComponent({
  logicData,
  item,
  onCancel,
}: {
  logicData: ReturnType<typeof useBuildInventoryItemLogicData>;
  item: IInventoryItem;
  onCancel: () => void;
}) {
  const {
    buildValidatedFormState: { field: buildField, validate: validateBuild, state: buildState },
    buildMutation: { mutate: build, isLoading: buildIsPending },
  } = logicData;

  const maxBuildable = useMemo(() => {
    if (!item.components.length) return 0;
    return Math.floor(
      Math.min(
        ...item.components.map(c =>
          Number(c.current_quantity) / Number(c.quantity_required)
        )
      )
    );
  }, [item.components]);

  async function submit() {
    if (!await validateBuild()) return;
    build();
  }

  if (!item.components.length) {
    return (
      <div className="flex flex-col gap-4">
        <p className="text-sm text-gray-600">
          Este item não possui componentes cadastrados. Adicione componentes ao criar ou editar o item.
        </p>

        <div className="flex justify-end">
          <FormButton
            variant="subtle"
            color="gray"
            onClick={onCancel}
          >
            Fechar
          </FormButton>
        </div>
      </div>
    );
  }

  return (
    <Form
      onSubmit={submit}
      className="flex flex-col gap-4"
    >
      <div className="flex flex-col gap-1">
        <span className="text-sm font-medium text-gray-700">
          Componentes necessários por unidade
        </span>

        <div className="flex flex-col gap-1.5 p-3 bg-gray-50 rounded">
          <UtilsFor
            each={item.components}
            eachKey={({ item: comp }) => String(comp.id)}
          >
            {({ item: comp }) => {
              const required = Number(comp.quantity_required) * buildState.quantity;
              const available = Number(comp.current_quantity);
              const ok = available >= required;
              return (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-700">
                    {comp.name}
                  </span>

                  <div className="flex items-center gap-2">
                    <span className="text-gray-500">
                      {`Necessário: ${required}`}
                    </span>

                    <Badge
                      size="sm"
                      color={ok ? 'green' : 'red'}
                    >
                      {`Disponível: ${available}`}
                    </Badge>
                  </div>
                </div>
              );
            }}
          </UtilsFor>
        </div>
      </div>

      <div className="flex items-end gap-3">
        <FormNumberInput
          label="Quantidade a construir"
          placeholder="1"
          min={1}
          max={maxBuildable}
          required
          className="flex-1"
          {...buildField('quantity')}
        />

        <p className="text-xs text-gray-500 pb-2">
          {`Máx. possível: ${maxBuildable}`}
        </p>
      </div>

      <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
        <FormButton
          variant="subtle"
          color="gray"
          onClick={onCancel}
          disabled={buildIsPending}
        >
          Cancelar
        </FormButton>

        <FormButton
          type="submit"
          color="primary"
          loading={buildIsPending}
          disabled={maxBuildable === 0}
        >
          Construir
        </FormButton>
      </div>
    </Form>
  );
}
