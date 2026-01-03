import { NextResponse } from 'next/server';
import blogsData from '@/data/blogs.json';

export async function GET() {
  return NextResponse.json({ blogs: blogsData.blogs });
}
