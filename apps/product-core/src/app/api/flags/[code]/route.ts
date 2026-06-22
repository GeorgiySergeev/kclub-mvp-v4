import { readFile } from 'node:fs/promises';
import path from 'node:path';

import { NextResponse } from 'next/server';

import { HERO_FLAG_CODES, type HeroFlagCode } from '@/features/marketing/constants/hero-flag-codes';

const FLAG_CODES = new Set<string>(HERO_FLAG_CODES);

export async function GET(
  _request: Request,
  context: { params: Promise<{ code: HeroFlagCode }> },
): Promise<Response> {
  const { code } = await context.params;

  if (!FLAG_CODES.has(code)) {
    return NextResponse.json({ error: 'Flag not found' }, { status: 404 });
  }

  try {
    const filePath = path.join(process.cwd(), 'src/assets/flags.svg', `${code}.svg`);
    const svg = await readFile(filePath, 'utf8');

    return new NextResponse(svg, {
      headers: {
        'Cache-Control': 'public, max-age=31536000, immutable',
        'Content-Type': 'image/svg+xml',
      },
    });
  } catch {
    return NextResponse.json({ error: 'Flag not found' }, { status: 404 });
  }
}
