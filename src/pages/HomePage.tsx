/**
 * HomePage — Landing page displaying the interactive periodic table
 * and a randomized "Discover an Element" feature card.
 */
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
