import { db } from '@/libs/db';
import { itemCategories } from '@/db/schema';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const rows = await db.select().from(itemCategories).orderBy(itemCategories.name);
    return NextResponse.json({ success: true, message: 'Operação realizada com sucesso.', data: rows });
  } catch {
    return NextResponse.json({ success: false, message: 'Erro ao buscar categorias.', data: null }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.name || !body.color_hex) {
      return NextResponse.json({ success: false, message: 'Nome e cor são obrigatórios.', data: null }, { status: 422 });
    }

    const now = new Date();
    const [category] = await db.insert(itemCategories).values({
      name: body.name,
      colorHex: body.color_hex,
      createdAt: now,
      updatedAt: now,
    }).returning();

    return NextResponse.json({ success: true, message: 'Categoria criada com sucesso.', data: category }, { status: 201 });
  } catch {
    return NextResponse.json({ success: false, message: 'Erro ao criar categoria.', data: null }, { status: 500 });
  }
}
