import { getter, type Hook } from "@/src/utils/data";
import { MultiSelect, MultiSelectProps } from "@mantine/core";
import { useMemo } from "react";
import { FormInputPropsOnChange, FormInputPropsOnValidate } from "./types";
import { useNotFirstEffect } from "@/src/utils/hooks";

export type FormMultiSelectProps<T> = Omit<FormInputPropsOnChange<MultiSelectProps>, 'data'> & FormInputPropsOnValidate & {
  data?: T[];
  valueField?: Hook<T>;
  labelField?: Hook<T>;
};

export function FormMultiSelect<T>({ value, onChange, onValidate, ...props }: FormMultiSelectProps<T>) {
  useNotFirstEffect(() => {
    onValidate?.();
  }, [value]);

  const data = useMemo(() => {
    if (!Array.isArray(props.data)) return [];

    if (props.valueField || props.labelField) return (props.data as any[]).map(item => ({
      value: getter(item, props.valueField),
      label: getter(item, props.labelField)
    }));

    return props.data as MultiSelectProps['data'];
  }, [props.data, props.valueField, props.labelField]);

  return (
    <MultiSelect
      {...props}
      value={value}
      clearable={!props.disabled}
      data={data}
      onChange={event => onChange?.(event)}
      onBlur={onValidate}
    />
  );
}