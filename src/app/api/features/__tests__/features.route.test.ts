import { describe, it, expect, beforeEach, vi } from 'vitest'
import { GET } from '../route'
import { db } from '@/app/server/db'

const mockFeature = {
  id: 1,
  name: 'Test Feature',
  description: 'Test Description',
  createdAt: new Date(),
  updatedAt: new Date()
}

describe('Features API', () => {
  const mockRequest = (params = {}) => {
    const searchParams = new URLSearchParams(params)
    return new Request(`http://localhost/api/features?${searchParams.toString()}`)
  }

  beforeEach(() => {
    vi.clearAllMocks()
    
    // Reset mock implementation for each test
    vi.mocked(db.select).mockImplementation((fields?: any) => ({
      fields: {},
      session: null,
      dialect: {},
      withList: [],
      distinct: false,
      from: vi.fn().mockReturnValue({
        limit: vi.fn().mockReturnValue({
          offset: vi.fn().mockReturnValue({
            orderBy: vi.fn().mockResolvedValue([mockFeature])
          })
        }),
        then: vi.fn().mockImplementation((callback) => {
          if (fields?.count) {
            return Promise.resolve(callback([{ count: 1 }]));
          }
          return Promise.resolve(callback([mockFeature]));
        })
      })
    } as unknown as ReturnType<typeof db.select>))
  })

  it('should validate pagination parameters', async () => {
    const request = mockRequest({ page: 'invalid' })
    const response = await GET(request)
    expect(response.status).toBe(400)
  })

  it('should handle valid pagination parameters', async () => {
    const request = mockRequest({ 
      page: '1',
      pageSize: '10',
      sortBy: 'createdAt',
      sortOrder: 'desc'
    })
    
    const response = await GET(request)
    expect(response.status).toBe(200)
    
    const data = await response.json()
    expect(data).toHaveProperty('data')
    expect(data).toHaveProperty('total')
    expect(data).toHaveProperty('page', 1)
    expect(data).toHaveProperty('pageSize', 10)
  })

  it('should apply correct database query', async () => {
    const request = mockRequest({ page: '1', pageSize: '10' })
    await GET(request)
    expect(db.select).toHaveBeenCalled()
  })

  it('should handle empty results', async () => {
    // Mock for the results query
    vi.mocked(db.select).mockReturnValueOnce({
      fields: {},
      session: null,
      dialect: {},
      withList: [],
      distinct: false,
      from: vi.fn().mockReturnValue({
        limit: vi.fn().mockReturnValue({
          offset: vi.fn().mockReturnValue({
            orderBy: vi.fn().mockResolvedValue([])
          })
        })
      })
    } as unknown as ReturnType<typeof db.select>)

    // Mock for the count query
    vi.mocked(db.select).mockReturnValueOnce({
      fields: {},
      session: null,
      dialect: {},
      withList: [],
      distinct: false,
      from: vi.fn().mockReturnValue({
        then: vi.fn().mockResolvedValue([{ count: 0 }])
      })
    } as unknown as ReturnType<typeof db.select>)
    
    const request = mockRequest({ page: '1' })
    const response = await GET(request)
    const data = await response.json()
    
    expect(response.status).toBe(200)
    expect(data.data).toHaveLength(0)
    expect(data.total).toEqual([{ count: 0 }])
  })
})
