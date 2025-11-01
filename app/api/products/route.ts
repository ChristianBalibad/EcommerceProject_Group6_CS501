import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category');
    const gender = searchParams.get('gender');
    const color = searchParams.get('color');
    const search = searchParams.get('search');

    const where: { category?: string; gender?: string; OR?: Array<{ name: { contains: string; mode: string } } | { description: { contains: string; mode: string } }> } = {};

    if (category) {
      where.category = category;
    }

    if (gender) {
      where.gender = gender;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    let products = await prisma.product.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    if (color) {
      const colorFilters = color.split(',').map((c: string) => c.trim().toLowerCase()).filter((c: string) => c);
      
      if (colorFilters.length > 0) {
        products = products.filter((product: typeof products[0]) => {
          try {
            const productColors = JSON.parse(product.colors || '[]');
            return productColors.some((c: { name: string }) => 
              colorFilters.includes(c.name.toLowerCase())
            );
          } catch {
            return false;
          }
        });
      }
    }

    return NextResponse.json({ products });
  } catch (error) {
    console.error('Get products error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      slug,
      category,
      gender,
      price,
      originalPrice,
      description,
      images,
      stock,
      sizes,
      colors,
    } = body;

    if (!name || !slug || !category || !price || !description || !images) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const existingProduct = await prisma.product.findUnique({
      where: { slug },
    });

    if (existingProduct) {
      return NextResponse.json(
        { error: 'Product with this slug already exists' },
        { status: 409 }
      );
    }

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        category,
        gender: gender || 'unisex',
        price: parseFloat(price),
        originalPrice: originalPrice ? parseFloat(originalPrice) : null,
        description,
        images: images || '[]',
        stock: stock ? parseInt(stock) : 0,
        sizes: sizes || '',
        colors: colors || '[]',
      },
    });

    return NextResponse.json({ product }, { status: 201 });
  } catch (error) {
    console.error('Create product error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

