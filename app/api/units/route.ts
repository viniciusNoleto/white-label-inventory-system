import { db } from '@/libs/db';
import { units } from '@/db/schema/units';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const rows = await db.select().from(units).orderBy(units.name);
    return NextResponse.json({ success: true, message: 'Operação realizada com sucesso.', data: rows });
  } catch {
    return NextResponse.json({ success: false, message: 'Erro ao buscar unidades.', data: null }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.name || !body.abbreviation) {
      return NextResponse.json({ success: false, message: 'Nome e abreviação são obrigatórios.', data: null }, { status: 422 });
    }

    const now = new Date();
    const [unit] = await db.insert(units).values({
      name: body.name,
      abbreviation: body.abbreviation,
      createdAt: now,
      updatedAt: now,
    }).returning();

    return NextResponse.json({ success: true, message: 'Unidade criada com sucesso.', data: unit }, { status: 201 });
  } catch {
    return NextResponse.json({ success: false, message: 'Erro ao criar unidade.', data: null }, { status: 500 });
  }
}
