import { db } from '@/libs/db';
import { inventoryItems, inventoryItemHasComponent } from '@/db/schema';
import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const quantity = Number(body.quantity ?? 1);

    if (quantity <= 0) {
      return NextResponse.json({ success: false, message: 'Quantidade deve ser maior que zero.', data: null }, { status: 422 });
    }

    const components = await db
      .select({
        component_id: inventoryItemHasComponent.componentInventoryItemId,
        quantity_required: inventoryItemHasComponent.quantityRequired,
        current_quantity: inventoryItems.quantity,
        component_name: inventoryItems.name,
      })
      .from(inventoryItemHasComponent)
      .innerJoin(inventoryItems, eq(inventoryItemHasComponent.componentInventoryItemId, inventoryItems.id))
      .where(eq(inventoryItemHasComponent.inventoryItemId, BigInt(id)));

    if (!components.length) {
      return NextResponse.json({ success: false, message: 'Este item não possui componentes cadastrados.', data: null }, { status: 422 });
    }

    // Check if there's enough stock for each component
    for (const comp of components) {
      const required = Number(comp.quantity_required) * quantity;
      const available = Number(comp.current_quantity);
      if (available < required) {
        return NextResponse.json({
          success: false,
          message: `Estoque insuficiente de "${comp.component_name}". Necessário: ${required}, Disponível: ${available}.`,
          data: null,
        }, { status: 422 });
      }
    }

    const now = new Date();

    // Deduct components
    for (const comp of components) {
      const deduct = Number(comp.quantity_required) * quantity;
      const newQty = Number(comp.current_quantity) - deduct;
      await db
        .update(inventoryItems)
        .set({ quantity: String(newQty), updated_at: now })
        .where(eq(inventoryItems.id, comp.component_id));
    }

    // Increment the built item
    const [target] = await db.select().from(inventoryItems).where(eq(inventoryItems.id, BigInt(id)));
    const newQty = Number(target.quantity) + quantity;
    const [updated] = await db
      .update(inventoryItems)
      .set({ quantity: String(newQty), updated_at: now })
      .where(eq(inventoryItems.id, BigInt(id)))
      .returning();

    return NextResponse.json({ success: true, message: `${quantity} unidade(s) construída(s) com sucesso.`, data: updated });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ success: false, message: 'Erro ao construir item.', data: null }, { status: 500 });
  }
}
