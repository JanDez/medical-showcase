import { metrics } from '@/app/server/db/schema';
import { db } from '@/app/server/db';
import type { Metric } from '@/app/features/types/types';

export const createTestMetric = async (data: Partial<Metric> = {}): Promise<Metric> => {
  const [metric] = await db.insert(metrics).values({
    name: data.name ?? 'Test Metric',
    description: data.description ?? 'Test Description',
    calculation: data.calculation ?? 'count(*)',
    businessQuestions: data.businessQuestions ?? ['test question'],
    metricIds: data.metricIds ?? ['M1'],
    affiliateApplicability: data.affiliateApplicability ?? ['all'],
  }).returning();
  
  if (!metric) throw new Error('Failed to create metric');
  return {
    ...metric,
    description: metric.description ?? undefined,
    calculation: metric.calculation ?? undefined,
    businessQuestions: metric.businessQuestions ?? undefined,
    metricIds: metric.metricIds ?? undefined,
    affiliateApplicability: metric.affiliateApplicability ?? undefined,
  } as Metric;
};


export const mockError = (message: string): Error => {
  return new Error(message);
};
