import { db } from '@/libs/db';
import { inventoryItems } from '@/db/schema';
import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    if (body.quantity === undefined || body.quantity === null) {
      return NextResponse.json({ success: false, message: 'Quantidade é obrigatória.', data: null }, { status: 422 });
    }

    const [updated] = await db
      .update(inventoryItems)
      .set({ quantity: String(body.quantity), updated_at: new Date() })
      .where(eq(inventoryItems.id, BigInt(id)))
      .returning();

    if (!updated) {
      return NextResponse.json({ success: false, message: 'Item não encontrado.', data: null }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Quantidade atualizada com sucesso.', data: updated });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ success: false, message: 'Erro ao atualizar quantidade.', data: null }, { status: 500 });
  }
}
