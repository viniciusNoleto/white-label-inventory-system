'use client';

import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Modal, Badge, NumberInput } from '@mantine/core';
import { Icon } from '@iconify/react';
import { UtilsCard } from '@/src/components/utils/Card';
import { UtilsTable } from '@/src/components/utils/Table';
import { UtilsFor } from '@/src/components/utils/For';
import { FormButton } from '@/src/components/form/Button';
import { FormTextInput } from '@/src/components/form/TextInput';
import { useRecordState, useImmediateState } from '@/src/utils/state';
import { useDebouncedEffect } from '@/src/utils/hooks';
import { getInventoryItemsService, GET_INVENTORY_ITEMS_KEY } from '@/src/resources/inventory-item/services/getInventoryItems';
import { useCreateUnitLogicData, CreateUnitLogicComponent } from '@/src/resources/unit/logics/CreateUnit';
import { useCreateItemCategoryLogicData, CreateItemCategoryLogicComponent } from '@/src/resources/item-category/logics/CreateItemCategory';
import { useCreateInventoryItemLogicData, CreateInventoryItemLogicComponent } from '@/src/resources/inventory-item/logics/CreateInventoryItem';
import { useUpdateQuantityLogicData, UpdateQuantityLogicComponent } from '@/src/resources/inventory-item/logics/UpdateQuantity';
import { useBuildInventoryItemLogicData, BuildInventoryItemLogicComponent } from '@/src/resources/inventory-item/logics/BuildInventoryItem';
import type { IInventoryItem } from '@/src/resources/inventory-item/models/InventoryItem';
import type { PaginatedMeta } from '@/src/shared/types/api';
import Link from 'next/link';

type ModalKey = 'createUnit' | 'createCategory' | 'createItem' | 'updateQuantity' | 'build';

export default function InventoryPage() {
  const { t } = useTranslation();
  const [page, setPage] = useImmediateState(1);
  const [modals, setModals] = useState<Partial<Record<ModalKey, boolean>>>({});
  const [editingItem, setEditingItem] = useState<IInventoryItem | null>(null);
  const [editingQuantities, setEditingQuantities] = useState<Record<string, number>>({});

  const { state: filters, field: filterField } = useRecordState({ search: '' });

  const {
    data: itemsData,
    isFetching: itemsIsFetching,
    refetch: itemsRefetch,
  } = useQuery({
    queryKey: GET_INVENTORY_ITEMS_KEY,
    queryFn: ({ signal }) =>
      getInventoryItemsService({
        signal,
        query: { search: filters.search || undefined, page, per_page: 15 },
      }),
  });

  useDebouncedEffect(() => {
    setPage(1);
    itemsRefetch();
  }, [filters], 500);

  const items = useMemo(() => itemsData?.data?.items ?? [], [itemsData]);
  const meta = useMemo<Partial<PaginatedMeta>>(() => itemsData?.data?.meta ?? {}, [itemsData]);

  function openModal(key: ModalKey) { setModals(prev => ({ ...prev, [key]: true })); }
  function closeModal(key: ModalKey) { setModals(prev => ({ ...prev, [key]: false })); }

  const createUnitLogicData = useCreateUnitLogicData({
    onSuccess: () => closeModal('createUnit'),
  });

  const createCategoryLogicData = useCreateItemCategoryLogicData({
    onSuccess: () => closeModal('createCategory'),
  });

  const createItemLogicData = useCreateInventoryItemLogicData({
    onSuccess: () => {
      itemsRefetch();
      closeModal('createItem');
    },
  });

  const updateQuantityLogicData = useUpdateQuantityLogicData({
    editingItemId: String(editingItem?.id ?? ''),
    onSuccess: () => {
      itemsRefetch();
      closeModal('updateQuantity');
    },
  });

  const buildLogicData = useBuildInventoryItemLogicData({
    editingItemId: String(editingItem?.id ?? ''),
    onSuccess: () => {
      itemsRefetch();
      closeModal('build');
    },
  });

  function openUpdateQuantity(item: IInventoryItem) {
    setEditingItem(item);
    updateQuantityLogicData.updateQuantityInit(item);
    openModal('updateQuantity');
  }

  function openBuild(item: IInventoryItem) {
    setEditingItem(item);
    buildLogicData.buildReset();
    openModal('build');
  }

  function handleInlineQuantityBlur(item: IInventoryItem) {
    const qty = editingQuantities[String(item.id)];
    if (qty === undefined) return;
    updateInventoryItemQuantityInline(item, qty);
  }

  async function updateInventoryItemQuantityInline(item: IInventoryItem, quantity: number) {
    try {
      const res = await fetch(`/api/inventory-items/${item.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity }),
      });
      const data = await res.json();
      if (data.success) itemsRefetch();
    } catch {
      // silently fail - user can use the modal instead
    }
  }

  return (
    <main className="flex flex-col flex-1 gap-6 p-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <Icon
              icon="lucide:arrow-left"
              className="w-5 h-5"
            />
          </Link>

          <div className="flex flex-col">
            <h1 className="text-2xl font-bold text-gray-900">
              {t('inventory.page.title')}
            </h1>

            <span className="text-sm text-gray-500">
              {t('inventory.page.subtitle')}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <FormButton
            variant="default"
            leftIcon="lucide:ruler"
            onClick={() => {
              createUnitLogicData.createUnitReset();
              openModal('createUnit');
            }}
          >
            {t('inventory.actions.newUnit')}
          </FormButton>

          <FormButton
            variant="default"
            leftIcon="lucide:tag"
            onClick={() => {
              createCategoryLogicData.createItemCategoryReset();
              openModal('createCategory');
            }}
          >
            {t('inventory.actions.newCategory')}
          </FormButton>

          <FormButton
            color="primary"
            leftIcon="lucide:plus"
            onClick={() => {
              createItemLogicData.createInventoryItemReset();
              openModal('createItem');
            }}
          >
            {t('inventory.actions.newItem')}
          </FormButton>
        </div>
      </div>

      <UtilsCard className="flex flex-col gap-6">
        <FormTextInput
          placeholder={t('inventory.search.placeholder')}
          leftSection={
            <Icon
              icon="lucide:search"
              className="text-gray-400"
            />
          }
          className="max-w-xs w-full"
          {...filterField('search')}
        />

        <UtilsTable
          rows={items}
          rowKey={({ item }) => String(item.id)}
          loading={itemsIsFetching}
          lastPage={meta.last_page ?? 1}
          page={page}
          setPage={(newPage) => {
            setPage(newPage);
            itemsRefetch();
          }}
          emptyText={t('inventory.table.empty')}
          columns={{
            name: t('inventory.table.columns.name'),
            categories: t('inventory.table.columns.categories'),
            quantity: t('inventory.table.columns.quantity'),
            unit: t('inventory.table.columns.unit'),
          }}
          renderCells={{
            categories: ({ item }) => (
              <div className="flex flex-wrap gap-1">
                <UtilsFor
                  each={item.categories}
                  eachKey={({ item: cat }) => String(cat.id)}
                  empty={<span className="text-gray-400 text-xs">—</span>}
                >
                  {({ item: cat }) => (
                    <Badge
                      size="xs"
                      style={{ backgroundColor: cat.color_hex, color: '#fff' }}
                    >
                      {cat.name}
                    </Badge>
                  )}
                </UtilsFor>
              </div>
            ),
            quantity: ({ item }) => (
              <NumberInput
                size="xs"
                min={0}
                step={1}
                value={editingQuantities[String(item.id)] ?? Number(item.quantity)}
                onChange={(v) => setEditingQuantities(prev => ({ ...prev, [String(item.id)]: Number(v) }))}
                onBlur={() => handleInlineQuantityBlur(item)}
                className="w-28"
                styles={{ input: { textAlign: 'right' } }}
              />
            ),
            unit: ({ item }) => (
              <span className="text-gray-600 text-xs font-medium">
                {item.unit.abbreviation}
              </span>
            ),
          }}
          actions={({ item }) => [
            {
              icon: 'lucide:pencil',
              label: t('inventory.rowActions.editQuantity'),
              onClick: () => openUpdateQuantity(item),
            },
            {
              valid: item.components.length,
              icon: 'lucide:package-plus',
              label: t('inventory.rowActions.build'),
              color: 'primary',
              onClick: ({ item }: { item: IInventoryItem }) => openBuild(item),
            },
          ].filter(a => a.valid === undefined || a.valid)}
        />
      </UtilsCard>

      {/* Modal — Nova Unidade */}
      <Modal
        opened={!!modals.createUnit}
        onClose={() => closeModal('createUnit')}
        title={t('inventory.modals.createUnit')}
        size="sm"
        centered
      >
        <CreateUnitLogicComponent
          logicData={createUnitLogicData}
          onCancel={() => closeModal('createUnit')}
        />
      </Modal>

      {/* Modal — Nova Categoria */}
      <Modal
        opened={!!modals.createCategory}
        onClose={() => closeModal('createCategory')}
        title={t('inventory.modals.createCategory')}
        size="sm"
        centered
      >
        <CreateItemCategoryLogicComponent
          logicData={createCategoryLogicData}
          onCancel={() => closeModal('createCategory')}
        />
      </Modal>

      {/* Modal — Novo Item */}
      <Modal
        opened={!!modals.createItem}
        onClose={() => closeModal('createItem')}
        title={t('inventory.modals.createItem')}
        size="lg"
        centered
      >
        <CreateInventoryItemLogicComponent
          logicData={createItemLogicData}
          onCancel={() => closeModal('createItem')}
        />
      </Modal>

      {/* Modal — Editar Quantidade */}
      <Modal
        opened={!!modals.updateQuantity}
        onClose={() => closeModal('updateQuantity')}
        title={t('inventory.modals.updateQuantity')}
        size="sm"
        centered
      >
        {editingItem && (
          <UpdateQuantityLogicComponent
            logicData={updateQuantityLogicData}
            itemName={editingItem.name}
            onCancel={() => closeModal('updateQuantity')}
          />
        )}
      </Modal>

      {/* Modal — Construir */}
      <Modal
        opened={!!modals.build}
        onClose={() => closeModal('build')}
        title={t('inventory.modals.build', { name: editingItem?.name ?? '' })}
        size="md"
        centered
      >
        {editingItem && (
          <BuildInventoryItemLogicComponent
            logicData={buildLogicData}
            item={editingItem}
            onCancel={() => closeModal('build')}
          />
        )}
      </Modal>
    </main>
  );
}
