// Demo authentication — localStorage-backed.
// Passwords hashed with SubtleCrypto SHA-256 (NOT production-grade; no salt/PBKDF2).
// Replace with Firebase/Supabase/your own API for real auth.

export interface User {
  id: string
  name: string
  email: string
  phone?: string
  createdAt: string
}

export interface Address {
  id: string
  label: string
  name: string
  phone: string
  line1: string
  city: string
  state: string
  pin: string
  isDefault?: boolean
}

interface StoredUser extends User {
  passwordHash: string
  addresses: Address[]
}

const USERS_KEY = 'cad.users'
const SESSION_KEY = 'cad.session'

// ── helpers ──

async function hash(pw: string): Promise<string> {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(pw))
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('')
}

function readUsers(): StoredUser[] {
  try { return JSON.parse(localStorage.getItem(USERS_KEY) || '[]') } catch { return [] }
}
function writeUsers(u: StoredUser[]) { localStorage.setItem(USERS_KEY, JSON.stringify(u)) }

function readSession(): string | null {
  try { return localStorage.getItem(SESSION_KEY) } catch { return null }
}

// ── public API ──

export function currentUser(): User | null {
  const id = readSession()
  if (!id) return null
  const u = readUsers().find(u => u.id === id)
  if (!u) return null
  const { passwordHash: _, addresses: __, ...pub } = u
  return pub
}

export function getStoredUser(id: string): StoredUser | undefined {
  return readUsers().find(u => u.id === id)
}

export async function signup(name: string, email: string, password: string): Promise<{ ok: boolean; user?: User; error?: string }> {
  const users = readUsers()
  if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
    return { ok: false, error: 'An account with this email already exists.' }
  }
  if (password.length < 6) return { ok: false, error: 'Password must be at least 6 characters.' }

  const user: StoredUser = {
    id: 'usr-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    name,
    email: email.toLowerCase(),
    passwordHash: await hash(password),
    createdAt: new Date().toISOString(),
    addresses: [],
  }
  users.push(user)
  writeUsers(users)
  localStorage.setItem(SESSION_KEY, user.id)
  const { passwordHash: _, addresses: __, ...pub } = user
  return { ok: true, user: pub }
}

export async function login(email: string, password: string): Promise<{ ok: boolean; user?: User; error?: string }> {
  const users = readUsers()
  const u = users.find(u => u.email.toLowerCase() === email.toLowerCase())
  if (!u) return { ok: false, error: 'No account found with this email.' }
  if (u.passwordHash !== await hash(password)) return { ok: false, error: 'Incorrect password.' }
  localStorage.setItem(SESSION_KEY, u.id)
  const { passwordHash: _, addresses: __, ...pub } = u
  return { ok: true, user: pub }
}

export function logout() {
  localStorage.removeItem(SESSION_KEY)
}

export function updateProfile(updates: Partial<Pick<User, 'name' | 'phone'>>): User | null {
  const id = readSession()
  if (!id) return null
  const users = readUsers()
  const idx = users.findIndex(u => u.id === id)
  if (idx === -1) return null
  if (updates.name) users[idx].name = updates.name
  if (updates.phone !== undefined) users[idx].phone = updates.phone
  writeUsers(users)
  const { passwordHash: _, addresses: __, ...pub } = users[idx]
  return pub
}

export async function changePassword(current: string, next: string): Promise<{ ok: boolean; error?: string }> {
  const id = readSession()
  if (!id) return { ok: false, error: 'Not signed in.' }
  const users = readUsers()
  const idx = users.findIndex(u => u.id === id)
  if (idx === -1) return { ok: false, error: 'User not found.' }
  if (users[idx].passwordHash !== await hash(current)) return { ok: false, error: 'Current password is incorrect.' }
  if (next.length < 6) return { ok: false, error: 'New password must be at least 6 characters.' }
  users[idx].passwordHash = await hash(next)
  writeUsers(users)
  return { ok: true }
}

// ── Addresses ──

export function getAddresses(): Address[] {
  const id = readSession()
  if (!id) return []
  return getStoredUser(id)?.addresses || []
}

export function saveAddress(addr: Omit<Address, 'id'> & { id?: string }): Address[] {
  const id = readSession()
  if (!id) return []
  const users = readUsers()
  const idx = users.findIndex(u => u.id === id)
  if (idx === -1) return []
  const full: Address = { ...addr, id: addr.id || 'addr-' + Date.now().toString(36) }
  if (full.isDefault) users[idx].addresses.forEach(a => (a.isDefault = false))
  const ai = users[idx].addresses.findIndex(a => a.id === full.id)
  if (ai >= 0) users[idx].addresses[ai] = full
  else users[idx].addresses.push(full)
  writeUsers(users)
  return users[idx].addresses
}

export function removeAddress(addrId: string): Address[] {
  const id = readSession()
  if (!id) return []
  const users = readUsers()
  const idx = users.findIndex(u => u.id === id)
  if (idx === -1) return []
  users[idx].addresses = users[idx].addresses.filter(a => a.id !== addrId)
  writeUsers(users)
  return users[idx].addresses
}

// ── Link guest orders to account ──

export function linkGuestOrders(email: string) {
  // This is called after signup/login to associate guest orders
  // with the user account by email. Orders are stored in cad.orders.
  try {
    const ordersRaw = localStorage.getItem('cad.orders')
    if (!ordersRaw) return
    const orders = JSON.parse(ordersRaw)
    const userId = readSession()
    if (!userId) return
    let changed = false
    orders.forEach((o: any) => {
      if (!o.userId && o.customer?.email?.toLowerCase() === email.toLowerCase()) {
        o.userId = userId
        changed = true
      }
    })
    if (changed) localStorage.setItem('cad.orders', JSON.stringify(orders))
  } catch { /* ignore */ }
}
