import StaggerGroup from './motion/StaggerGroup.jsx';

// Responsive card grid; children are <Card>s (or any <StaggerItem>). `cols` = desktop column count.
const COLS = { 2: 'md:grid-cols-2', 3: 'md:grid-cols-3', 4: 'md:grid-cols-2 lg:grid-cols-4' };

export default function BentoGrid({ cols = 3, className = '', children }) {
  return <StaggerGroup className={`grid gap-5 ${COLS[cols]} ${className}`}>{children}</StaggerGroup>;
}
