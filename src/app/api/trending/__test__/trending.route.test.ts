import { describe, it, expect, beforeEach, vi } from 'vitest';
import { GET } from '../route';
import { db } from '@/app/server/db';

const mockAsset = {
  id: 1,
  name: 'Test Asset',
  description: 'Test Description',
  viewCount: 100,
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('Trending API', () => {
  const mockRequest = (params = {}) => {
    const searchParams = new URLSearchParams(params);
    return new Request(`http://localhost/api/trending?${searchParams.toString()}`);
  };

  beforeEach(() => {
    vi.clearAllMocks();

    // Reset mock implementation for each test
    vi.mocked(db.select).mockImplementation(() => ({
      fields: {},
      session: null,
      dialect: {},
      withList: [],
      distinct: false,
      from: vi.fn().mockReturnValue({
        limit: vi.fn().mockReturnValue({
          offset: vi.fn().mockReturnValue({
            orderBy: vi.fn().mockResolvedValue([mockAsset]),
          }),
        }),
      }),
    }) as unknown as ReturnType<typeof db.select>);
  });

  it('should validate pagination parameters', async () => {
    const request = mockRequest({ page: 'invalid' });
    const response = await GET(request);
    expect(response.status).toBe(400);
  });

  it('should apply correct database query', async () => {
    const request = mockRequest({ page: '1', pageSize: '10' });
    await GET(request);
    expect(db.select).toHaveBeenCalled();
  });

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
            orderBy: vi.fn().mockResolvedValue([]),
          }),
        }),
      }),
    } as unknown as ReturnType<typeof db.select>);

    // Mock for the count query
    vi.mocked(db.select).mockReturnValueOnce({
      fields: {},
      session: null,
      dialect: {},
      withList: [],
      distinct: false,
      from: vi.fn().mockReturnValue({
        then: vi.fn().mockResolvedValue([{ count: 0 }]),
      }),
    } as unknown as ReturnType<typeof db.select>);

    const request = mockRequest({ page: '1' });
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.data).toHaveLength(0);
    expect(data.total).toEqual([{ count: 0 }]);
  });
}); 