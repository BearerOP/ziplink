# Wallet Adapter Guide

## What is a Wallet Adapter?

A **Wallet Adapter** is a standardized interface that allows your application to communicate with different types of wallets in a consistent way. Think of it as a translator between your app and various wallet implementations.

## Why Do You Need a Wallet Adapter?

Without a wallet adapter, you'd need to write custom code for every wallet:
```typescript
// ❌ Without adapter - messy!
if (walletType === 'phantom') {
  await window.phantom.solana.connect()
} else if (walletType === 'solflare') {
  await window.solflare.connect()
} else if (walletType === 'custom') {
  await customWallet.initialize()
}
```

With a wallet adapter, all wallets use the same interface:
```typescript
// ✅ With adapter - clean!
await adapter.connect()
```

## Core Adapter Interface

Every wallet adapter must implement these methods:

```typescript
interface WalletAdapter {
  // Properties
  publicKey: string | null          // Current connected public key
  isZipLink?: boolean               // Is this a ZipLink-managed wallet?
  
  // Connection Methods
  connect(): Promise<{ publicKey: string }>
  disconnect(): Promise<void>
  
  // Signing Methods
  signTransaction(payload: SignPayload): Promise<{ signature: Uint8Array }>
  signAllTransactions(payloads: SignPayload[]): Promise<{ signatures: Uint8Array[] }>
  signMessage(message: Uint8Array): Promise<{ signature: Uint8Array }>
  
  // Event Handling
  on<K extends keyof WalletAdapterEvents>(event: K, callback: WalletAdapterEvents[K]): void
  off<K extends keyof WalletAdapterEvents>(event: K, callback: WalletAdapterEvents[K]): void
}
```

## Types of Wallet Adapters

### 1. Browser Extension Adapter
Wraps wallet browser extensions (Phantom, Solflare, etc.)

**Use Case**: User has a wallet extension installed in their browser

**Example**:
```typescript
const adapter = createBrowserWalletAdapter(window.phantom.solana, 'Phantom')
```

### 2. Backend/Custodial Adapter
Communicates with your backend to manage wallets

**Use Case**: Embedded wallets, email login, social login

**Example**:
```typescript
const adapter = createBackendWalletAdapter({
  apiEndpoint: 'https://api.yourapp.com',
  userId: 'user@email.com',
  apiKey: 'secret-key'
})
```

### 3. MPC (Multi-Party Computation) Adapter
Uses threshold signatures for enhanced security

**Use Case**: High-security applications, institutional wallets

**Example**:
```typescript
const adapter = createMPCWalletAdapter({
  shardIds: ['shard1', 'shard2', 'shard3'],
  threshold: 2,
  coordinatorUrl: 'https://mpc.yourapp.com'
})
```

### 4. Mobile Wallet Adapter
Deep-links to mobile wallet apps

**Use Case**: Mobile dApps that need to connect to wallet apps

### 5. Hardware Wallet Adapter
Connects to hardware wallets (Ledger, Trezor)

**Use Case**: Users who store keys on hardware devices

## How to Create a Custom Adapter

### Step 1: Define Your Adapter Class/Factory

```typescript
export function createMyCustomAdapter(config: MyConfig): WalletAdapter {
  let publicKey: string | null = null
  const listeners = new Map<string, Set<Function>>()
  
  // Your implementation here...
}
```

### Step 2: Implement Event Management

```typescript
const on = (event: string, cb: Function) => {
  if (!listeners.has(event)) listeners.set(event, new Set())
  listeners.get(event)!.add(cb)
}

const off = (event: string, cb: Function) => {
  listeners.get(event)?.delete(cb)
}

const emit = (event: string, ...args: any[]) => {
  listeners.get(event)?.forEach(fn => fn(...args))
}
```

### Step 3: Implement Core Methods

```typescript
return {
  get publicKey() { return publicKey },
  isZipLink: true,
  
  async connect() {
    // 1. Connect to wallet
    // 2. Get public key
    // 3. Emit 'connect' event
    emit('connect')
    return { publicKey: '...' }
  },
  
  async disconnect() {
    publicKey = null
    emit('disconnect')
  },
  
  async signTransaction(payload) {
    // Sign the transaction
    return { signature: new Uint8Array(...) }
  },
  
  async signAllTransactions(payloads) {
    // Sign multiple transactions
    return { signatures: [...] }
  },
  
  async signMessage(message) {
    // Sign arbitrary message
    return { signature: new Uint8Array(...) }
  },
  
  on,
  off,
}
```

## Real-World Example: Email Wallet Adapter

Here's a complete example of an adapter that manages wallets via email:

```typescript
interface EmailWalletConfig {
  apiUrl: string
  email: string
}

export function createEmailWalletAdapter(config: EmailWalletConfig): WalletAdapter {
  let currentPublicKey: string | null = null
  let sessionToken: string | null = null
  const listeners = new Map<string, Set<Function>>()

  // Event management
  const on = (event: string, cb: Function) => {
    if (!listeners.has(event)) listeners.set(event, new Set())
    listeners.get(event)!.add(cb)
  }
  const off = (event: string, cb: Function) => listeners.get(event)?.delete(cb)
  const emit = (event: string, ...args: any[]) => {
    listeners.get(event)?.forEach(fn => fn(...args))
  }

  // API helper
  const apiCall = async (endpoint: string, data: any) => {
    const response = await fetch(`${config.apiUrl}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(sessionToken && { 'Authorization': `Bearer ${sessionToken}` })
      },
      body: JSON.stringify(data)
    })
    return response.json()
  }

  return {
    get publicKey() { return currentPublicKey },
    isZipLink: true,

    async connect() {
      // Send email OTP
      await apiCall('/auth/send-otp', { email: config.email })
      
      // Get OTP from user (in real app, show a modal)
      const otp = prompt('Enter OTP from email:')
      
      // Verify and get wallet
      const result = await apiCall('/auth/verify-otp', { 
        email: config.email, 
        otp 
      })
      
      currentPublicKey = result.publicKey
      sessionToken = result.sessionToken
      emit('connect')
      
      return { publicKey: currentPublicKey! }
    },

    async disconnect() {
      await apiCall('/auth/logout', {})
      currentPublicKey = null
      sessionToken = null
      emit('disconnect')
    },

    async signTransaction(payload: SignPayload) {
      const result = await apiCall('/wallet/sign', {
        transaction: Array.from(payload.transaction)
      })
      return { signature: new Uint8Array(result.signature) }
    },

    async signAllTransactions(payloads: SignPayload[]) {
      const result = await apiCall('/wallet/sign-batch', {
        transactions: payloads.map(p => Array.from(p.transaction))
      })
      return { 
        signatures: result.signatures.map((s: number[]) => new Uint8Array(s))
      }
    },

    async signMessage(message: Uint8Array) {
      const result = await apiCall('/wallet/sign-message', {
        message: Array.from(message)
      })
      return { signature: new Uint8Array(result.signature) }
    },

    on,
    off
  }
}
```

## Using Your Adapter in the App

Once you create an adapter, integrate it into your wallet context:

```typescript
// In wallet-context.tsx
import { createEmailWalletAdapter } from '@/lib/wallet/email-adapter'

// Add to available wallets
if (userEmail) {
  const emailAdapter = createEmailWalletAdapter({
    apiUrl: 'https://api.yourapp.com',
    email: userEmail
  })
  wallets.push({ 
    name: 'Email Wallet', 
    icon: '📧', 
    adapter: emailAdapter, 
    installed: true 
  })
}
```

## Best Practices

1. **Always handle errors gracefully**
   ```typescript
   try {
     await adapter.connect()
   } catch (error) {
     console.error('Connection failed:', error)
     // Show user-friendly error message
   }
   ```

2. **Emit events when state changes**
   ```typescript
   // When account changes
   emit('accountChanged', newPublicKey)
   // When disconnected
   emit('disconnect')
   ```

3. **Validate responses from external services**
   ```typescript
   if (!response.publicKey || !isValidPublicKey(response.publicKey)) {
     throw new Error('Invalid public key received')
   }
   ```

4. **Implement proper cleanup**
   ```typescript
   async disconnect() {
     // Clear all listeners
     listeners.clear()
     // Clean up resources
     // Emit disconnect event
     emit('disconnect')
   }
   ```

5. **Add logging for debugging**
   ```typescript
   console.log('[MyAdapter] Connecting...', { publicKey })
   ```

## Testing Your Adapter

```typescript
// Test basic flow
const adapter = createMyAdapter(config)

// Test connection
const { publicKey } = await adapter.connect()
console.log('Connected:', publicKey)

// Test signing
const signature = await adapter.signTransaction({
  transaction: txBytes
})
console.log('Signed:', signature)

// Test events
adapter.on('disconnect', () => {
  console.log('Disconnected!')
})

// Test cleanup
await adapter.disconnect()
```

## Common Pitfalls

1. ❌ **Not handling async errors**
2. ❌ **Forgetting to emit events**
3. ❌ **Not clearing listeners on disconnect**
4. ❌ **Assuming external APIs are always available**
5. ❌ **Not validating user input**

## Next Steps

- See `custom-adapter-example.ts` for complete implementations
- Check `adapter.ts` for the interface definitions
- Look at `wallet-context.tsx` to see how adapters are used
- Read the Solana wallet adapter documentation for more details

## Resources

- [Solana Wallet Standard](https://github.com/solana-labs/wallet-standard)
- [Wallet Adapter Documentation](https://github.com/solana-labs/wallet-adapter)
- [Solana Web3.js Docs](https://solana-labs.github.io/solana-web3.js/)

