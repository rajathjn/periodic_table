import React from 'react';
import PeriodicTable from '../components/PeriodicTable';
import DiscoverElement from '../components/DiscoverElement';

const HomePage: React.FC = () => {
  return (
    <main>
      <PeriodicTable />
      <DiscoverElement />
    </main>
  );
};

export default HomePage;
