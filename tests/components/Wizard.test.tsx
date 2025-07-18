/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen } from '@testing-library/react';
import Wizard from '../../src/components/Wizard';
import '@testing-library/jest-dom';

describe('Wizard Component', () => {
  it('renders previous and next buttons', () => {
    render(<Wizard><div>Step 1</div></Wizard>);
    expect(screen.getByText('◀️ Previous')).toBeInTheDocument();
    expect(screen.getByText('▶️ Next')).toBeInTheDocument();
  });
});
