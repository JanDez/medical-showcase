import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AssetRequest {
  id: number
  name: string
  description: string
  status: 'pending' | 'approved' | 'rejected'
  createdAt: Date
}

interface RequestStore {
  requests: AssetRequest[]
  addRequest: (name: string, description: string) => void
  getRequests: () => AssetRequest[]
}

export const useRequestStore = create<RequestStore>()(
  persist(
    (set, get) => ({
      requests: [],
      addRequest: (name, description) => set((state) => ({
        requests: [...state.requests, {
          id: state.requests.length + 1,
          name,
          description,
          status: 'pending',
          createdAt: new Date()
        }]
      })),
      getRequests: () => get().requests
    }),
    {
      name: 'request-storage'
    }
  )
) 