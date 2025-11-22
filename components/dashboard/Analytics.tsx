import React, { useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { Patient } from '../../types';

interface AnalyticsProps {
  data: Patient[];
}

const COLORS = ['#9F6449', '#D4A373', '#FAEDCD', '#CCD5AE', '#E9EDC9', '#8D99AE'];

export const Analytics: React.FC<AnalyticsProps> = ({ data }) => {
  
  // 1. Lead Source Distribution
  const sourceData = useMemo(() => {
    const counts: Record<string, number> = {};
    data.forEach(p => {
      const source = p.leadSource || 'Unknown';
      counts[source] = (counts[source] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [data]);

  // 2. Visit Type (Pie)
  const visitTypeData = useMemo(() => {
    const counts: Record<string, number> = {};
    data.forEach(p => {
      const type = p.visitType || 'Unknown';
      counts[type] = (counts[type] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [data]);

  // 3. Ad Attribution (only for those who selected ads)
  const adData = useMemo(() => {
    const counts: Record<string, number> = {};
    data.forEach(p => {
      if (p.adAttribution) {
        counts[p.adAttribution] = (counts[p.adAttribution] || 0) + 1;
      }
    });
    return Object.entries(counts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [data]);

  return (
    <div className="space-y-8">
      
      {/* Top Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Lead Source Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#9F6449]/10">
          <h3 className="text-lg font-bold text-[#9F6449] mb-6">Lead Sources</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sourceData} layout="vertical" margin={{ left: 30 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" />
                <YAxis type="category" dataKey="name" width={100} fontSize={12} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                />
                <Bar dataKey="value" fill="#9F6449" radius={[0, 4, 4, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Visit Type Pie Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#9F6449]/10">
          <h3 className="text-lg font-bold text-[#9F6449] mb-6">First-Time vs Returning</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={visitTypeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {visitTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bottom Row - Ad Attribution */}
      {adData.length > 0 && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#9F6449]/10">
          <h3 className="text-lg font-bold text-[#9F6449] mb-6">Ad Campaign Performance</h3>
          <div className="h-[300px]">
             <ResponsiveContainer width="100%" height="100%">
              <BarChart data={adData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" fontSize={12} interval={0} angle={-10} textAnchor="end" height={60} />
                <YAxis />
                <Tooltip 
                   cursor={{fill: '#F5EAE6'}}
                   contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                />
                <Bar dataKey="value" fill="#D4A373" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};