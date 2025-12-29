import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { password } = await request.json();
    
    // Простий пароль для адміна (в production використовуйте env змінну)
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin2025';
    
    if (password === ADMIN_PASSWORD) {
      return NextResponse.json({ 
        success: true,
        message: 'Authentication successful' 
      });
    }
    
    return NextResponse.json(
      { 
        success: false,
        error: 'Invalid password' 
      },
      { status: 401 }
    );
  } catch (error) {
    console.error('Authentication error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Authentication failed' 
      },
      { status: 500 }
    );
  }
}