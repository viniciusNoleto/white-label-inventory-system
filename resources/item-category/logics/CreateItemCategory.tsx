'use client';

import { useMutation } from '@tanstack/react-query';
import { notifications } from '@mantine/notifications';
import * as yup from 'yup';
import { Form } from '@/src/components/form/Form';
import { FormButton } from '@/src/components/form/Button';
import { FormTextInput } from '@/src/components/form/TextInput';
import { useValidatedFormState } from '@/src/utils/state';
import { createItemCategoryService } from '../services/createItemCategory';
import { ColorInput } from '@mantine/core';

const createItemCategorySchema = yup.object({
  name: yup.string().default('').required('Nome é obrigatório').max(100),
  color_hex: yup.string().default('#6F1FF9').required('Cor é obrigatória'),
});

export function useCreateItemCategoryLogicData({ onSuccess }: { onSuccess: () => void }) {
  const createItemCategoryValidatedFormState = useValidatedFormState(createItemCategorySchema);

  const createItemCategoryMutation = useMutation({
    mutationFn: () => createItemCategoryService({ body: createItemCategoryValidatedFormState.state }),
    onSuccess: (res) => {
      notifications.show({ message: res.message, color: 'green' });
      onSuccess();
    },
    onError: (err: any) => {
      notifications.show({
        title: 'Erro',
        message: err?.message ?? 'Não foi possível criar a categoria. Tente novamente.',
        color: 'red',
      });
    },
  });

  function createItemCategoryReset() {
    createItemCategoryValidatedFormState.setState(createItemCategorySchema.getDefault());
    createItemCategoryValidatedFormState.setErrors({});
  }

  return { createItemCategoryValidatedFormState, createItemCategoryMutation, createItemCategoryReset };
}

export function CreateItemCategoryLogicComponent({
  logicData,
  onCancel,
}: {
  logicData: ReturnType<typeof useCreateItemCategoryLogicData>;
  onCancel: () => void;
}) {
  const {
    createItemCategoryValidatedFormState: {
      field: categoryField,
      validate: validateCategory,
      setValue: setCategoryValue,
    },
    createItemCategoryMutation: { mutate: createItemCategory, isLoading: createItemCategoryIsPending },
  } = logicData;

  async function submit() {
    if (!await validateCategory()) return;
    createItemCategory();
  }

  return (
    <Form
      onSubmit={submit}
      className="flex flex-col gap-4"
    >
      <FormTextInput
        label="Nome"
        placeholder="Ex: Matéria-Prima"
        required
        {...categoryField('name')}
      />

      <ColorInput
        label="Cor"
        placeholder="#6F1FF9"
        required
        value={categoryField('color_hex').value}
        onChange={(v) => setCategoryValue('color_hex', v)}
        error={categoryField('color_hex').error}
        format="hex"
        swatches={['#6F1FF9', '#881FF9', '#2482ED', '#E31E24', '#2ecc71', '#f39c12', '#e74c3c', '#1abc9c']}
      />

      <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
        <FormButton
          variant="subtle"
          color="gray"
          onClick={onCancel}
          disabled={createItemCategoryIsPending}
        >
          Cancelar
        </FormButton>

        <FormButton
          type="submit"
          color="primary"
          loading={createItemCategoryIsPending}
        >
          Salvar
        </FormButton>
      </div>
    </Form>
  );
}
