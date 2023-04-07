import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import axios from 'axios';
import useSWR from 'swr';
import App, { fetcher } from './App';

jest.mock('axios');
jest.mock('swr');

describe('App component', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  test('displays error message when data fails to load', async () => {
    useSWR.mockReturnValue({
      data: null,
      error: true,
    });

    render(<App />);
    expect(screen.getByText('Error loading data')).toBeInTheDocument();
  });

  test('displays loading message when data is being fetched', () => {
    useSWR.mockReturnValue({
      data: null,
      error: null,
    });

    render(<App />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  test('displays fetched data correctly', async () => {
    const testData = [
      {
        item_id: 1,
        item_name: 'Item 1',
        item_image_url: 'http://example.com/image.jpg',
        created_at: '2021-01-01',
        user_name: 'User 1',
      },
    ];

    axios.get.mockResolvedValueOnce({ data: testData });

    useSWR.mockReturnValue({
      data: testData,
      error: null,
    });

    render(<App />);
    await waitFor(() => {
      expect(screen.getByText('Item 1')).toBeInTheDocument();
      expect(screen.getByText('Created at: 2021-01-01')).toBeInTheDocument();
      expect(screen.getByText('By User 1')).toBeInTheDocument();
    });
  });

  test('fetcher function returns data from the server', async () => {
    const testData = [{ id: 1, name: 'Test' }];

    axios.get.mockResolvedValueOnce({ data: testData });

    const result = await fetcher('/test');

    expect(result).toEqual(testData);
    expect(axios.get).toHaveBeenCalledWith('/test');
  });
});
