// Save auth info after login
export function saveAuth(token: string, email: string) {
    if (typeof window !== 'undefined') {
        localStorage.setItem('admin_token', token)
        localStorage.setItem('admin_email', email)
    }
}

// Read token for API calls
export function getToken(): string | null {
    if (typeof window === 'undefined') return null
    return localStorage.getItem('admin_token')
}

// Get logged in user email
export function getEmail(): string | null {
    if (typeof window === 'undefined') return null
    return localStorage.getItem('admin_email')
}

// Clear auth on logout
export function clearAuth() {
    if (typeof window !== 'undefined') {
        localStorage.removeItem('admin_token')
        localStorage.removeItem('admin_email')
    }
}

// Build auth headers for fetch calls
export function authHeaders() {
    const token = getToken()
    const headers: Record<string, string> = { 'Content-Type': 'application/json' }
    if (token) headers['Authorization'] = `Bearer ${token}`
    return headers
}

// Check if user is logged in (has a token)
export function isLoggedIn(): boolean {
    return !!getToken()
}