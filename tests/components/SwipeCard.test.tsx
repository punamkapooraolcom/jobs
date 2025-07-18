/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen } from '@testing-library/react';
import SwipeCard from '../../src/components/swipe-card';
import '@testing-library/jest-dom';
import { profiles } from '@/lib/data';

describe('SwipeCard Component', () => {
  const mockProfile = profiles[0];

  it('renders the card with profile details', () => {
    render(<SwipeCard profile={mockProfile} />);
    
    expect(screen.getByText(mockProfile.title)).toBeInTheDocument();
    expect(screen.getByText(mockProfile.name)).toBeInTheDocument();
    expect(screen.getByText('2.4 km away')).toBeInTheDocument(); // Example distance
    expect(screen.getByText('$25/hr')).toBeInTheDocument(); // Example salary
    expect(screen.getByText(mockProfile.skills.join(', '))).toBeInTheDocument();
    
    const image = screen.getByAltText(mockProfile.name);
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', expect.stringContaining('placehold.co'));
  });
});
