import React, { useMemo } from 'react';

import { UtilsFor } from '@/src/components/utils/For';
import { FormButton, type FormButtonProps } from '../form/Button';
import { UtilsIf } from './If';
import { LoadingOverlay, Pagination } from '@mantine/core';

export type TableProps<T extends object, U extends Record<string, string>> = {
  title?: string;
  rows: T[];
  columns: U;
  loading?: boolean;
  emptyText?: string;
  alias?: React.ReactNode;
  rowKey?: TableRowKey<T>;
  actions?: TableActions<T>;
  renderCells?: TableRenderCells<T, U>;
} & (
  {
    lastPage: number;
    page: number;
    setPage: (page: number) => void;
  } | {
    lastPage?: never;
    page?: never;
    setPage?: never;
  }
);

export function UtilsTable<T extends object, U extends Record<string, string>>({
  title = '',
  columns,
  rows,
  loading = false,
  emptyText = 'Nenhum dado encontrado',
  lastPage,
  page,
  alias,
  setPage,
  rowKey,
  actions,
  renderCells,
}: TableProps<T, U>) {

  const showActions = useMemo(() => actions && (typeof actions === 'function' || actions.length > 0), [actions]);
  const _columns = useMemo(() => Object.entries(columns).map(([field, label]) => ({ field, label })), [columns]);
  const colCount = useMemo(() => _columns.length + (showActions ? 1 : 0), [_columns, showActions]);

  return (
    <section className="flex flex-col gap-2">
      <UtilsIf condition={title}>
        {() => (
          <section className="flex items-center justify-between gap-4 px-2">
            <span className="text-lg font-semibold">{title}</span>

            {alias}
          </section>
        )}
      </UtilsIf>

      <section className="flex flex-col relative">
        <LoadingOverlay
          visible={loading}
          zIndex={1}
          overlayProps={{ blur: 2 }}
          loaderProps={{ color: 'primary', type: 'bars' }}
        />

        <section className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 dark:bg-neutral-800/40">
                <UtilsFor
                  each={_columns}
                  eachKey={({item: column}) => column.field}
                >
                  {({item: column}) => (
                    <th
                      key={column.field}
                      scope="col"
                      className="px-6 py-4 text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider"
                    >
                      {column.label}
                    </th>
                  )}
                </UtilsFor>

                {showActions ? (
                  <th
                    scope="col"
                    className="px-6 py-4 text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider text-right"
                  >
                    Ações
                  </th>
                ) : null}
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              <UtilsFor
                each={rows}
                eachKey={({item: row, index: rowIdx}) => rowKey?.({item: row, index: rowIdx}) ?? rowIdx}
                empty={
                  <tr>
                    <td
                      colSpan={colCount}
                      className="px-6 py-8 text-center text-sm text-gray-500 dark:text-gray-400"
                    >
                      {emptyText}
                    </td>
                  </tr>
                }
              >
                {({item: row, index: rowIdx}) => (
                  <tr className="group hover:bg-gray-50/50 dark:hover:bg-gray-800/40 transition-colors">
                    <UtilsFor
                      each={_columns}
                      eachKey={({item: column}) => column.field}
                    >
                      {({item: column}) => (
                        <td className="px-6 py-4 text-sm">
                          {
                            renderCells && renderCells[column.field] ?
                              renderCells[column.field]!({
                                item: row,
                                index: rowIdx,
                              })
                                :
                              (row as any)[column.field]
                          }
                        </td>
                      )}
                    </UtilsFor>

                    {showActions ? (
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <UtilsFor each={typeof actions === 'function' ? actions({ item: row, index: rowIdx }) : (actions || [])}>
                            {({item: action}) => (
                              <FormButton
                                {...action}
                                size="compact-xs"
                                variant="transparent"
                                aria-label={action.label}
                                label={action.icon ? undefined : action.label}
                                tooltip={action.label}
                                onClick={() => action.onClick?.({ item: row, index: rowIdx })}
                              />
                            )}
                          </UtilsFor>
                        </div>
                      </td>
                    ) : null}
                  </tr>
                )}
              </UtilsFor>
            </tbody>
          </table>
        </section>

        <UtilsIf condition={!!(lastPage && lastPage > 1)}>
          {() => (
            <div className="flex justify-center pt-4 border-t border-gray-50 dark:border-gray-800 mt-2">
              <Pagination
                total={lastPage ?? 0}
                value={page ?? 1}
                onChange={page => setPage?.(page)}
                color="primary"
              />
            </div>
          )}
        </UtilsIf>
      </section>
    </section>
  );
}

type TableRenderCells<T extends object, U extends Record<string, string>> = Partial<Record<keyof U, (ctx: { item: T, index: number }) => React.ReactNode|string>>;

type TableRowKey<T extends object> = (ctx: { item: T, index: number }) => React.Key;

type TableAction<T extends object> = Omit<FormButtonProps, 'onClick'> & {
  label?: string;
  icon?: string;
  onClick?: (ctx: { item: T, index: number }) => void;
}

type TableActions<T extends object> = TableAction<T>[] | ((ctx: { item: T, index: number }) => TableAction<T>[]);
