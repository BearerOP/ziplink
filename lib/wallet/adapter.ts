export interface WalletAdapterEvents {
  connect: () => void
  disconnect: () => void
  accountChanged: (pubkey: string | null) => void
}

export interface SignPayload {
  transaction: Uint8Array
  origin?: string
}

export interface WalletAdapter {
  publicKey: string | null
  isZipLink?: boolean
  connect: () => Promise<{ publicKey: string }>
  disconnect: () => Promise<void>
  signTransaction: (payload: SignPayload) => Promise<{ signature: Uint8Array }>
  signAllTransactions: (payloads: SignPayload[]) => Promise<{ signatures: Uint8Array[] }>
  signMessage: (message: Uint8Array) => Promise<{ signature: Uint8Array }>
  on: <K extends keyof WalletAdapterEvents>(event: K, cb: WalletAdapterEvents[K]) => void
  off: <K extends keyof WalletAdapterEvents>(event: K, cb: WalletAdapterEvents[K]) => void
}

// Example policy and routing envelope
export type Policy = {
  domainWhitelist?: string[]
  dailySpendLimitLamports?: number
  requireBiometric?: boolean
}

export type AdapterContext = {
  policy: Policy
  // add telemetry, logger, etc.
}

// A simple no‑op adapter useful for development and UI tests.
export function createDevAdapter(): WalletAdapter {
  let pk: string | null = "DevPublicKey1111111111111111111111111111111"
  const listeners = new Map<string, Set<Function>>()

  const on = (event: string, cb: Function) => {
    if (!listeners.has(event)) listeners.set(event, new Set())
    listeners.get(event)!.add(cb)
  }
  const off = (event: string, cb: Function) => {
    listeners.get(event)?.delete(cb)
  }
  const emit = (event: string, ...args: any[]) => {
    listeners.get(event)?.forEach((fn) => fn(...args))
  }

  return {
    publicKey: pk,
    isZipLink: true,
    async connect() {
      emit("connect")
      return { publicKey: pk! }
    },
    async disconnect() {
      pk = null
      emit("disconnect")
    },
    async signTransaction() {
      // DO NOT USE IN PRODUCTION — mock signature
      return { signature: new Uint8Array([1, 2, 3]) }
    },
    async signAllTransactions(payloads) {
      return { signatures: payloads.map(() => new Uint8Array([1, 2, 3])) }
    },
    async signMessage() {
      return { signature: new Uint8Array([9, 9, 9]) }
    },
    on,
    off,
  }
}
