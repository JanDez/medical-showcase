import { describe, it, expect, beforeEach, vi } from 'vitest';
import { GET } from '../route';
import { db } from '@/app/server/db';

const mockStoryboard = {
  id: 1,
  name: 'Test Storyboard',
  description: 'A test storyboard',
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('Storyboard API', () => {
  const mockRequest = (params = {}) => {
    const searchParams = new URLSearchParams(params);
    return new Request(`http://localhost/api/storyboards?${searchParams.toString()}`);
  };

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(db.select).mockImplementation(() => ({
      fields: {},
      session: null,
      dialect: {},
      withList: [],
      distinct: false,
      from: vi.fn().mockReturnValue({
        limit: vi.fn().mockReturnValue({
          offset: vi.fn().mockReturnValue({
            orderBy: vi.fn().mockResolvedValue([mockStoryboard]),
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