// /components/SpendingChart.tsx
import { Card } from "@/components/ui/card";

type SpendingChartProps = {
  topCategories: { category: string; amount: number }[];
};

const SpendingChart: React.FC<SpendingChartProps> = ({ topCategories }) => {
  const maxValue = Math.max(...topCategories.map((category) => category.amount));

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-4">Top Spending Categories</h2>
      <div className="space-y-6">
        {topCategories.map((category, index) => (
          <div key={category.category} className="flex items-center space-x-4">
            <div className="w-1/3">{category.category}</div>
            <div className="w-2/3 h-4 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full ${['bg-blue-500', 'bg-green-500', 'bg-yellow-500'][index]}`}
                style={{ width: `${(category.amount / maxValue) * 100}%` }}
              />
            </div>
            <div className="w-1/6 text-right">
              {new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'GBP',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              }).format(category.amount)}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default SpendingChart;