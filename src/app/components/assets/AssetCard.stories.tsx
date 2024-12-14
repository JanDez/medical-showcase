import type { Meta, StoryObj } from '@storybook/react';
import { AssetCard } from './AssetCard';
import { FavoriteProvider, useFavoriteContext } from '@/app/features/contexts/FavoriteContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState, ReactNode } from 'react';

const queryClient = new QueryClient();

const FavoriteToggleProvider = ({ children }: { children: (props: { handleToggleFavorite: (assetId: number) => void; isFavorite: (id: number) => boolean }) => ReactNode }) => {
  const { toggleFavorite, isFavorite } = useFavoriteContext();
  const [favorites, setFavorites] = useState({});

  const handleToggleFavorite = (assetId: number) => {
    const currentState = isFavorite(assetId);
    toggleFavorite(assetId, currentState);
    setFavorites((prev) => ({ ...prev, [assetId]: !currentState }));
  };

  return (
    <FavoriteProvider>
      {children({ handleToggleFavorite, isFavorite })}
    </FavoriteProvider>
  );
};

const meta: Meta<typeof AssetCard> = {
  title: 'Components/AssetCard',
  component: AssetCard,
  decorators: [
    (Story) => (
      <QueryClientProvider client={queryClient}>
        <FavoriteToggleProvider>
          {(props) => <Story {...props} />}
        </FavoriteToggleProvider>
      </QueryClientProvider>
    )
  ]
};

export default meta;
type Story = StoryObj<typeof AssetCard>;

export const Default: Story = {
  args: {
    asset: {
      id: 1,
      name: 'Sample Asset',
      description: 'This is a sample asset description',
      type: 'kpi',
      updatedAt: new Date(),
      isFavorite: false,
      tags: ['sample', 'test'],
      visualsAvailable: true,
      lastViewed: new Date(),
      viewCount: 0,
      createdAt: new Date()
    }
  },
};

export const Favorited: Story = {
  args: {
    asset: {
      id: 1,
      name: 'Sample Asset',
      description: 'This is a sample asset description',
      type: 'kpi',
      updatedAt: new Date(),
      isFavorite: true,
      tags: ['sample', 'test'],
      visualsAvailable: true,
      lastViewed: new Date(),
      viewCount: 0,
      createdAt: new Date()
    }
  },
};