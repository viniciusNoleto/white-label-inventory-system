'use client';

import { useMutation } from '@tanstack/react-query';
import { notifications } from '@mantine/notifications';
import * as yup from 'yup';
import { Form } from '@/src/components/form/Form';
import { FormButton } from '@/src/components/form/Button';
import { FormTextInput } from '@/src/components/form/TextInput';
import { useValidatedFormState } from '@/src/utils/state';
import { createUnitService } from '../services/createUnit';

const createUnitSchema = yup.object({
  name: yup.string().default('').required('Nome é obrigatório').max(100),
  abbreviation: yup.string().default('').required('Abreviação é obrigatória').max(20),
});

export function useCreateUnitLogicData({ onSuccess }: { onSuccess: () => void }) {
  const createUnitValidatedFormState = useValidatedFormState(createUnitSchema);

  const createUnitMutation = useMutation({
    mutationFn: () => createUnitService({ body: createUnitValidatedFormState.state }),
    onSuccess: (res) => {
      notifications.show({ message: res.message, color: 'green' });
      onSuccess();
    },
    onError: (err: any) => {
      notifications.show({
        title: 'Erro',
        message: err?.message ?? 'Não foi possível criar a unidade. Tente novamente.',
        color: 'red',
      });
    },
  });

  function createUnitReset() {
    createUnitValidatedFormState.setState(createUnitSchema.getDefault());
    createUnitValidatedFormState.setErrors({});
  }

  return { createUnitValidatedFormState, createUnitMutation, createUnitReset };
}

export function CreateUnitLogicComponent({
  logicData,
  onCancel,
}: {
  logicData: ReturnType<typeof useCreateUnitLogicData>;
  onCancel: () => void;
}) {
  const {
    createUnitValidatedFormState: { field: unitField, validate: validateUnit },
    createUnitMutation: { mutate: createUnit, isPending: createUnitIsPending },
  } = logicData;

  async function submit() {
    if (!await validateUnit()) return;
    createUnit();
  }

  return (
    <Form
      onSubmit={submit}
      className="flex flex-col gap-4"
    >
      <FormTextInput
        label="Nome"
        placeholder="Ex: Quilograma"
        required
        {...unitField('name')}
      />

      <FormTextInput
        label="Abreviação"
        placeholder="Ex: kg"
        required
        {...unitField('abbreviation')}
      />

      <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
        <FormButton
          variant="subtle"
          color="gray"
          onClick={onCancel}
          disabled={createUnitIsPending}
        >
          Cancelar
        </FormButton>

        <FormButton
          type="submit"
          color="primary"
          loading={createUnitIsPending}
        >
          Salvar
        </FormButton>
      </div>
    </Form>
  );
}
