import { NextResponse } from 'next/server';
import { logInfo, logError } from '@/lib/utils/logger';
import { API_BASE_URL, forwardSetCookieHeaders } from '@/lib/utils/errorHandler';

const BACKEND_URL = API_BASE_URL;

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
    
    // ✅ CRITICAL: Skip NextAuth routes (signin, signout, callback, session, etc.)
    // But allow /api/auth/register and /api/auth/login to be proxied to backend
    // NextAuth routes: signin, signout, callback, session, csrf, providers, etc.
    const nextAuthRoutes = ['signin', 'signout', 'callback', 'session', 'csrf', 'providers', 'error'];
    const pathSegments = urlPath.split('/').filter(Boolean);
    
    // Check if this is a NextAuth route (not register/login)
    if (urlPath.startsWith('/api/auth/')) {
      const authRoute = pathSegments[2]; // Get the route after /api/auth/
      
      // If it's a NextAuth route (not register/login), skip proxying
      if (nextAuthRoutes.includes(authRoute)) {
        logInfo('[Catch-all] NextAuth route detected - skipping proxy:', urlPath);
        // Return 500 to indicate this should be handled by NextAuth
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
      // If it's /api/auth/register or /api/auth/login, continue to proxy to backend
      logInfo('[Catch-all] Backend auth route (register/login) - proxying:', urlPath);
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
    // BACKEND_URL should already include /api (e.g., http://localhost:5000/api)
    // path format: gemini, assessment/start, etc.
    // Result: {BACKEND_URL}/gemini or {BACKEND_URL}/assessment/start
    const cleanBackendUrl = BACKEND_URL.replace(/\/$/, ''); // Remove trailing slash
    const cleanPath = path.startsWith('/') ? path.slice(1) : path; // Remove leading slash
    
    // Ensure backend URL includes /api prefix
    // If BACKEND_URL doesn't end with /api, add it
    let backendUrl;
    if (cleanBackendUrl.endsWith('/api')) {
      // BACKEND_URL already includes /api, just append path
      backendUrl = `${cleanBackendUrl}/${cleanPath}${url.search}`;
    } else {
      // BACKEND_URL doesn't include /api, add it
      backendUrl = `${cleanBackendUrl}/api/${cleanPath}${url.search}`;
    }
    
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

    // Forward Set-Cookie headers from backend using centralized utility
    forwardSetCookieHeaders(response, nextResponse);

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

