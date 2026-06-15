import { getter, type Hook } from "@/src/utils/data";
import { type ComboboxItem, Combobox, TextInput, useCombobox } from '@mantine/core'
import { useMemo, useState } from "react";
import { FormInputPropsOnChange, FormInputPropsOnValidate } from "./types";
import { useDebouncedEffect, useNotFirstEffect } from "@/src/utils/hooks";

export type FormAutocompleteProps<T> = FormInputPropsOnChange<{}> & FormInputPropsOnValidate & {
  data?: T[];
  valueField?: Hook<T>;
  labelField?: Hook<T>;
  onComplete?: (value: string) => void;
  loading?: boolean;
  limit?: number;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  label?: string;
  placeholder?: string;
  description?: string;
};

export function FormAutocomplete<T>({ value, onChange, onValidate, limit = 10, ...props }: FormAutocompleteProps<T>) {
  
  const combobox = useCombobox()
  
  const [term, setTerm] = useState('');
  
  useDebouncedEffect(() => {
    props.onComplete?.(term)
  }, [term], 500);

  useNotFirstEffect(() => {
    onValidate?.();
  }, [value]);

  const data = useMemo<ComboboxItem[]>(() => {
    if (!props.data) return [];
  
    if (props.valueField || props.labelField) {
      return props.data.slice(0, limit).map(item => ({
        value: getter(item as any, props.valueField),
        label: getter(item as any, props.labelField)
      }));
    }
  
    return (props.data as string[]).slice(0, limit).map(item => ({
      value: item,
      label: item
    }));
  }, [props.data, props.valueField, props.labelField, limit]);

  return (
    <Combobox
      store={combobox}
      onOptionSubmit={(value, optionProps) => {
        onChange?.(value as any)

        // @ts-expect-error
        setTerm(optionProps.label)

        combobox.closeDropdown()
      }}
    >
      <Combobox.Target>
        <TextInput
          value={term}
          loading={props.loading}
          disabled={props.disabled}
          required={props.required}
          error={props.error}
          label={props.label}
          description={props.description}
          placeholder={props.placeholder}
          onChange={(event) => {
            setTerm(event.currentTarget.value)

            combobox.openDropdown()
          }}
          onFocus={() => combobox.openDropdown()}
          onBlur={() => {
            combobox.closeDropdown()

            onValidate?.()
          }}
        />
      </Combobox.Target>

      <Combobox.Dropdown className={data.length === 0 ? 'hidden' : ''}>
        <Combobox.Options>
          {data.map(item => (
            <Combobox.Option
              key={item.value}
              value={item.value}
              // @ts-expect-error
              label={item.label}
            >
              {item.label}
            </Combobox.Option>
          ))}
        </Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
  )
}
