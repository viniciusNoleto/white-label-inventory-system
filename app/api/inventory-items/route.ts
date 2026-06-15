import { db } from '@/libs/db';
import { inventoryItems, units, itemCategories, inventoryItemHasCategory, inventoryItemHasComponent } from '@/db/schema';
import { NextResponse } from 'next/server';
import { eq, ilike, and, sql } from 'drizzle-orm';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') ?? '';
    const page = Math.max(1, Number(searchParams.get('page') ?? 1));
    const perPage = Math.min(100, Math.max(1, Number(searchParams.get('per_page') ?? 15)));

    const where = search ? ilike(inventoryItems.name, `%${search}%`) : undefined;

    const [{ count }] = await db
      .select({ count: sql<number>`cast(count(*) as int)` })
      .from(inventoryItems)
      .where(where);

    const rows = await db
      .select({
        id: inventoryItems.id,
        name: inventoryItems.name,
        quantity: inventoryItems.quantity,
        created_at: inventoryItems.created_at,
        updated_at: inventoryItems.updated_at,
        unit_id: units.id,
        unit_name: units.name,
        unit_abbreviation: units.abbreviation,
      })
      .from(inventoryItems)
      .innerJoin(units, eq(inventoryItems.unit_id, units.id))
      .where(where)
      .orderBy(inventoryItems.name)
      .limit(perPage)
      .offset((page - 1) * perPage);

    // Fetch categories for each item
    const ids = rows.map(r => r.id);
    const categoryRows = ids.length > 0
      ? await db
          .select({
            inventory_item_id: inventoryItemHasCategory.inventoryItemId,
            id: itemCategories.id,
            name: itemCategories.name,
            color_hex: itemCategories.colorHex,
          })
          .from(inventoryItemHasCategory)
          .innerJoin(itemCategories, eq(inventoryItemHasCategory.itemCategoryId, itemCategories.id))
          .where(sql`${inventoryItemHasCategory.inventoryItemId} = ANY(${sql.raw(`ARRAY[${ids.join(',')}]::bigint[]`)})`)
      : [];

    // Fetch components for each item
    const componentRows = ids.length > 0
      ? await db
          .select({
            inventory_item_id: inventoryItemHasComponent.inventoryItemId,
            component_id: inventoryItemHasComponent.componentInventoryItemId,
            quantity_required: inventoryItemHasComponent.quantityRequired,
            component_name: inventoryItems.name,
            component_quantity: inventoryItems.quantity,
          })
          .from(inventoryItemHasComponent)
          .innerJoin(inventoryItems, eq(inventoryItemHasComponent.componentInventoryItemId, inventoryItems.id))
          .where(sql`${inventoryItemHasComponent.inventoryItemId} = ANY(${sql.raw(`ARRAY[${ids.join(',')}]::bigint[]`)})`)
      : [];

    const items = rows.map(row => ({
      id: row.id,
      name: row.name,
      quantity: row.quantity,
      created_at: row.created_at,
      updated_at: row.updated_at,
      unit: {
        id: row.unit_id,
        name: row.unit_name,
        abbreviation: row.unit_abbreviation,
      },
      categories: categoryRows
        .filter(c => String(c.inventory_item_id) === String(row.id))
        .map(c => ({ id: c.id, name: c.name, color_hex: c.color_hex })),
      components: componentRows
        .filter(c => String(c.inventory_item_id) === String(row.id))
        .map(c => ({
          id: c.component_id,
          name: c.component_name,
          quantity_required: c.quantity_required,
          current_quantity: c.component_quantity,
        })),
    }));

    const lastPage = Math.max(1, Math.ceil(count / perPage));

    return NextResponse.json({
      success: true,
      message: 'Operação realizada com sucesso.',
      data: {
        items,
        meta: { page, per_page: perPage, total: count, last_page: lastPage },
      },
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ success: false, message: 'Erro ao buscar itens.', data: null }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.name || !body.unit_id) {
      return NextResponse.json({ success: false, message: 'Nome e unidade são obrigatórios.', data: null }, { status: 422 });
    }

    const now = new Date();
    const [item] = await db.insert(inventoryItems).values({
      name: body.name,
      quantity: String(body.quantity ?? 0),
      unit_id: BigInt(body.unit_id),
      created_at: now,
      updated_at: now,
    }).returning();

    if (body.category_ids?.length) {
      await db.insert(inventoryItemHasCategory).values(
        body.category_ids.map((catId: string) => ({
          inventoryItemId: item.id,
          itemCategoryId: BigInt(catId),
          createdAt: now,
        }))
      );
    }

    if (body.components?.length) {
      await db.insert(inventoryItemHasComponent).values(
        body.components.map((c: { id: string; quantity_required: number }) => ({
          inventoryItemId: item.id,
          componentInventoryItemId: BigInt(c.id),
          quantityRequired: String(c.quantity_required),
          createdAt: now,
        }))
      );
    }

    return NextResponse.json({ success: true, message: 'Item criado com sucesso.', data: item }, { status: 201 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ success: false, message: 'Erro ao criar item.', data: null }, { status: 500 });
  }
}
