import { NextResponse } from 'next/server';
import blogsData from '@/data/blogs.json';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const blog = blogsData.blogs.find((b) => b.id === params.id);

  if (!blog) {
    return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
  }

  return NextResponse.json({ blog });
}
