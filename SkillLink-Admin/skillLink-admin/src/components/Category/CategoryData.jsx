import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

const categoriesData = [
  { name: "Frontend", posts: 120 },
  { name: "Backend", posts: 95 },
  { name: "UI/UX", posts: 80 },
  { name: "Mobile", posts: 65 },
  { name: "DevOps", posts: 50 },
  { name: "Data Science", posts: 40 },
  { name: "Security", posts: 35 },
  { name: "Testing", posts: 30 },
  { name: "Cloud", posts: 25 },
  { name: "AI/ML", posts: 20 },
  { name: "Blockchain", posts: 15 },
  { name: "Game Dev", posts: 10 },
  { name: "AR/VR", posts: 8 },
  { name: "Big Data", posts: 7 },
  { name: "Automation", posts: 5 },
  { name: "Other1", posts: 4 },
  { name: "Other2", posts: 3 },
  { name: "Other3", posts: 3 },
  { name: "Other4", posts: 2 },
  { name: "Other5", posts: 1 },
  { name: "Other6", posts: 1 },
  { name: "Other7", posts: 1 },
  { name: "Other8", posts: 1 },
  { name: "Other9", posts: 1 },
  { name: "Other10", posts: 1 },
  { name: "Other11", posts: 1 },
  { name: "Other12", posts: 1 },
  { name: "Other13", posts: 1 },
  { name: "Other14", posts: 1 },
  { name: "Other15", posts: 1 },
];

const prepareChartData = (data) => {
  const sorted = [...data].sort((a, b) => b.posts - a.posts);
  const top10 = sorted.slice(0, 10);
  const othersSum = sorted.slice(10).reduce((acc, cur) => acc + cur.posts, 0);
  if (othersSum > 0) {
    top10.push({ name: "Others", posts: othersSum });
  }
  return top10;
};

const CategoryChart = () => {
  const chartData = prepareChartData(categoriesData);

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md">
      <h3 className="text-xl font-bold mb-4">📚 Kateqoriyalara görə paylaşım sayı (Top 10 + Digərləri)</h3>
      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 60 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="name"
            angle={-45}
            textAnchor="end"
            interval={0}
            height={80}
          />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="posts" fill="#3b82f6" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CategoryChart;
