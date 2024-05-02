// /components/BalanceChart.tsx
import { Card } from "@/components/ui/card";

type BalanceChartProps = {
  expenses: number[];
  income: number[];
};

const BalanceChart: React.FC<BalanceChartProps> = ({ expenses, income }) => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const maxValue = Math.max(...expenses, ...income);

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-4">Balance</h2>
      <div className="flex space-x-2 overflow-x-auto w-full">
        {months.map((month, index) => (
          <div key={month} className="flex-1 flex flex-col items-center space-y-1">
            <div
              className="w-full bg-red-500 rounded-t-md"
              style={{ height: `${(expenses[index] / maxValue) * 80}px` }}
            />
            <div
              className="w-full bg-green-500 rounded-b-md"
              style={{ height: `${(income[index] / maxValue) * 80}px` }}
            />
            <div className="text-sm text-gray-500">{month}</div>
          </div>
        ))}
      </div>
      <div className="mt-4 flex space-x-4">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-red-500 rounded-full" />
          <span>Expenses</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-green-500 rounded-full" />
          <span>Income</span>
        </div>
      </div>
    </Card>
  );
};

export default BalanceChart;