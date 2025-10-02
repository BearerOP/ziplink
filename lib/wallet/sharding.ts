export type Shard = {
  id: string
  data: Uint8Array
}

export type ShardQuorum = {
  threshold: number
  total: number
}

export interface ShardStore {
  put: (shard: Shard) => Promise<void>
  get: (id: string) => Promise<Shard | null>
  list: () => Promise<Shard[]>
  remove: (id: string) => Promise<void>
}

// Example composition of stores: device, cloud, and trusted contact.
export type CompositeShardStore = {
  device: ShardStore
  cloud: ShardStore
  contact: ShardStore
}

export async function reconstructKey(quorum: ShardQuorum, shards: Shard[]): Promise<Uint8Array> {
  // Placeholder: in production, use Shamir's Secret Sharing or similar.
  if (shards.length < quorum.threshold) throw new Error("Not enough shards")
  // Deterministic mock
  return new Uint8Array([4, 2, 0, 1])
}
