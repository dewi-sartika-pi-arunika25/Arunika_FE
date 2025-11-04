import { NextResponse } from 'next/server';
import { logInfo, logError } from '@/lib/utils/logger';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Debug: Log backend URL in development
if (process.env.NODE_ENV === 'development') {
  console.log('[Proxy Config] BACKEND_URL:', BACKEND_URL);
}

export async function GET(request, context) {
  return proxyRequest(request, context);
}

export async function POST(request, context) {
  return proxyRequest(request, context);
}

export async function PUT(request, context) {
  return proxyRequest(request, context);
}

export async function DELETE(request, context) {
  return proxyRequest(request, context);
}

export async function PATCH(request, context) {
  return proxyRequest(request, context);
}

async function proxyRequest(request, context) {
  try {
    const url = new URL(request.url);
    
    // Extract path dari URL (remove /api prefix)
    // Example: /api/assessment/start -> assessment/start
    const urlPath = url.pathname;
    
    // ✅ CRITICAL: Skip NextAuth routes
    // In Next.js, /api/auth/[...nextauth] is MORE SPECIFIC than /api/[...catchall]
    // So Next.js should route to /api/auth/[...nextauth] FIRST, not catch-all
    // If we reach here for /api/auth/*, something is wrong with Next.js routing
    // But let's handle it gracefully by NOT proxying
    if (urlPath.startsWith('/api/auth/')) {
      logInfo('[Catch-all] NextAuth route detected - this should not reach catch-all!', urlPath);
      logInfo('[Catch-all] Next.js should route this to /api/auth/[...nextauth]/route.js');
      logInfo('[Catch-all] Check if /api/auth/[...nextauth]/route.js exists and is properly configured');
      
      // Don't proxy, but also don't return 404 - let Next.js handle it
      // Actually, if we're here, Next.js routing failed
      // Return 500 to indicate internal routing error
      return NextResponse.json(
        { 
          success: false,
          error: 'Internal routing error',
          message: 'NextAuth route should be handled by /api/auth/[...nextauth] but reached catch-all',
          hint: 'Check Next.js route configuration',
          timestamp: new Date().toISOString()
        },
        { status: 500 }
      );
    }
    
    const path = urlPath.startsWith('/api/') 
      ? urlPath.slice(5) // Remove '/api/'
      : urlPath.startsWith('/api')
      ? urlPath.slice(4)  // Remove '/api'
      : urlPath;
    
    const skipRoutes = ['provinces', 'cities', 'reset-password'];
    const firstSegment = path.split('/').filter(Boolean)[0]; // filter(Boolean) removes empty strings
    
    if (skipRoutes.includes(firstSegment)) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Route not found',
          timestamp: new Date().toISOString()
        },
        { status: 404 }
      );
    }

    // Build backend URL from environment variable
    // BACKEND_URL comes from NEXT_PUBLIC_API_URL env variable
    // path format: assessment/start
    // Result: {BACKEND_URL}/assessment/start
    const cleanBackendUrl = BACKEND_URL.replace(/\/$/, ''); // Remove trailing slash
    const cleanPath = path.startsWith('/') ? path.slice(1) : path; // Remove leading slash
    const backendUrl = `${cleanBackendUrl}/${cleanPath}${url.search}`;
    
    // Debug logging
    logInfo(`[Proxy] ${request.method} ${url.pathname}`);
    logInfo(`  → Extracted path: "${path}"`);
    logInfo(`  → Backend URL: ${backendUrl}`);

    // Get request body untuk POST/PUT/PATCH
    let body = null;
    if (['POST', 'PUT', 'PATCH'].includes(request.method)) {
      try {
        body = await request.text();
        // Log body in development for debugging
        if (process.env.NODE_ENV === 'development' && body) {
          logInfo(`  → Request body: ${body.substring(0, 100)}${body.length > 100 ? '...' : ''}`);
        }
      } catch (e) {
        logError('[Proxy] Error reading request body:', e);
        // No body - continue anyway
      }
    }

    // Forward request ke backend with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

    // Build headers
    const headers = {
      'Content-Type': 'application/json',
      // Forward important headers
      'Cookie': request.headers.get('cookie') || '',
      'Authorization': request.headers.get('authorization') || '',
    };

    const response = await fetch(backendUrl, {
      method: request.method,
      headers,
      body: body && body.length > 0 ? body : undefined, // Only send body if it exists and is not empty
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);

    // Get response body
    const responseText = await response.text();
    
    let responseData;
    try {
      responseData = JSON.parse(responseText);
    } catch {
      responseData = responseText;
    }

    // Create NextResponse with proper status
    const nextResponse = NextResponse.json(responseData, {
      status: response.status,
    });

    // Forward Set-Cookie headers from backend (important for httpOnly cookies)
    // Backend may send multiple Set-Cookie headers (access_token, refresh_token)
    const setCookieHeaders = response.headers.getSetCookie?.() || [];
    if (setCookieHeaders.length > 0) {
      // Forward each Set-Cookie header
      setCookieHeaders.forEach(cookie => {
        nextResponse.headers.append('Set-Cookie', cookie);
      });
    } else {
      // Fallback for older fetch implementations
      const setCookieHeader = response.headers.get('set-cookie');
      if (setCookieHeader) {
        nextResponse.headers.set('Set-Cookie', setCookieHeader);
      }
    }

    return nextResponse;

  } catch (error) {
    logError('[Proxy Error]', error);
    
    // Handle timeout specifically
    if (error.name === 'AbortError') {
      return NextResponse.json(
        { 
          success: false,
          error: 'Request timeout',
          message: 'Backend request took too long to respond',
          hint: 'The backend might be overloaded or not responding',
          timestamp: new Date().toISOString()
        },
        { status: 504 }
      );
    }
    
    // Handle other errors
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to proxy request to backend',
        message: error.message,
        hint: 'Make sure backend is running at ' + BACKEND_URL,
        timestamp: new Date().toISOString()
      },
      { status: 502 }
    );
  }
}

