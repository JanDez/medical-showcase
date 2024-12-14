// Must be first - no imports before this
import { vi } from 'vitest';

// Set required env vars before any other imports
process.env.SKIP_ENV_VALIDATION = 'true';
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test';
Object.defineProperty(process.env, 'NODE_ENV', {
  value: 'test',
  configurable: true,
  writable: true,
  enumerable: true
});

// Mock env before any imports
vi.mock('@/env.js', () => ({
  env: {
    DATABASE_URL: 'postgresql://test:test@localhost:5432/test',
    NODE_ENV: 'test',
  },
}));

const mockAsset = {
  id: 1,
  name: 'Asset 1',
  description: 'Test description',
  type: 'storyboard',
  isFavorite: false,
  visualsAvailable: false,
  tags: ['test'],
  viewCount: 0,
  lastViewed: null,
  createdAt: new Date(),
  updatedAt: new Date()
};

// Mock the database
vi.mock('@/app/server/db', () => ({
  db: {
    select: vi.fn().mockImplementation((params?: { count: unknown }) => ({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockReturnValue({
          limit: vi.fn().mockReturnValue({
            offset: vi.fn().mockReturnValue({
              orderBy: vi.fn().mockResolvedValue([mockAsset])
            })
          })
        }),
        then: vi.fn().mockImplementation((callback) => {
          if (params?.count) {
            return Promise.resolve(callback([{ count: 1 }]));
          }
          return Promise.resolve(callback([mockAsset]));
        })
      })
    }))
  }
}));

// Now we can safely import modules
import { config } from 'dotenv';
import { resolve } from 'path';

config({
  path: resolve(__dirname, '../../.env.test'),
  override: false
}); 