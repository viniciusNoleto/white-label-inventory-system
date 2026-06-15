'use client';

import { useMutation } from '@tanstack/react-query';
import { notifications } from '@mantine/notifications';
import * as yup from 'yup';
import { Form } from '@/src/components/form/Form';
import { FormButton } from '@/src/components/form/Button';
import { FormNumberInput } from '@/src/components/form/Number';
import { useValidatedFormState } from '@/src/utils/state';
import { updateInventoryItemQuantityService } from '../services/updateInventoryItemQuantity';
import type { IInventoryItem } from '../models/InventoryItem';

const updateQuantitySchema = yup.object({
  quantity: yup.number().default(0).min(0, 'Quantidade não pode ser negativa').required('Quantidade é obrigatória'),
});

export function useUpdateQuantityLogicData({
  editingItemId,
  onSuccess,
}: {
  editingItemId: string;
  onSuccess: () => void;
}) {
  const updateQuantityValidatedFormState = useValidatedFormState(updateQuantitySchema);

  const updateQuantityMutation = useMutation({
    mutationFn: () =>
      updateInventoryItemQuantityService({
        itemId: editingItemId,
        body: { quantity: updateQuantityValidatedFormState.state.quantity },
      }),
    onSuccess: (res) => {
      notifications.show({ message: res.message, color: 'green' });
      onSuccess();
    },
    onError: (err: any) => {
      notifications.show({
        title: 'Erro',
        message: err?.message ?? 'Não foi possível atualizar a quantidade.',
        color: 'red',
      });
    },
  });

  function updateQuantityInit(item: IInventoryItem) {
    updateQuantityValidatedFormState.setState({ quantity: Number(item.quantity) });
    updateQuantityValidatedFormState.setErrors({});
  }

  return { updateQuantityValidatedFormState, updateQuantityMutation, updateQuantityInit };
}

export function UpdateQuantityLogicComponent({
  logicData,
  itemName,
  onCancel,
}: {
  logicData: ReturnType<typeof useUpdateQuantityLogicData>;
  itemName: string;
  onCancel: () => void;
}) {
  const {
    updateQuantityValidatedFormState: { field: qtyField, validate: validateQty },
    updateQuantityMutation: { mutate: updateQuantity, isLoading: updateQuantityIsPending },
  } = logicData;

  async function submit() {
    if (!await validateQty()) return;
    updateQuantity();
  }

  return (
    <Form
      onSubmit={submit}
      className="flex flex-col gap-4"
    >
      <p className="text-sm text-gray-600">
        {`Defina a nova quantidade para "${itemName}".`}
      </p>

      <FormNumberInput
        label="Quantidade"
        placeholder="0"
        min={0}
        step={1}
        required
        {...qtyField('quantity')}
      />

      <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
        <FormButton
          variant="subtle"
          color="gray"
          onClick={onCancel}
          disabled={updateQuantityIsPending}
        >
          Cancelar
        </FormButton>

        <FormButton
          type="submit"
          color="primary"
          loading={updateQuantityIsPending}
        >
          Salvar
        </FormButton>
      </div>
    </Form>
  );
}
