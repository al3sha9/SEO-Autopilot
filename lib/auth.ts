// Simple authentication utilities for the blog platform
export interface User {
  email: string
}

// Hardcoded credentials as requested
const VALID_CREDENTIALS = {
  email: "ali@typs.dev",
  password: "mypass123",
}

export function validateCredentials(email: string, password: string): boolean {
  return email === VALID_CREDENTIALS.email && password === VALID_CREDENTIALS.password
}

export function setAuthCookie() {
  if (typeof window !== "undefined") {
    document.cookie = "auth=authenticated; path=/; max-age=86400" // 24 hours
  }
}

export function removeAuthCookie() {
  if (typeof window !== "undefined") {
    document.cookie = "auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
  }
}

export function isAuthenticated(): boolean {
  if (typeof window === "undefined") return false
  return document.cookie.includes("auth=authenticated")
}

export function getAuthUser(): User | null {
  if (isAuthenticated()) {
    return { email: VALID_CREDENTIALS.email }
  }
  return null
}
