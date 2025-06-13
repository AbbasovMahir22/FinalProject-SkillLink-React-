import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import axios from "axios";
import Spinner from "../Spinner";

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
  const [loading, setLoading] = useState(false);
  const [datas, setDatas] = useState([]);
  const apiUrl = import.meta.env.VITE_API_URL;
  const token = sessionStorage.getItem("token");
  useEffect(() => {
    const getDatas = async () => {
      setLoading(true);
      const res = await axios.get(`${apiUrl}/AdminAccount/GetPostCountByCategory`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      setDatas(res.data.$values.map(item => ({
        name: item.category,
        posts: item.postCount
      })))
      setLoading(false);

    }
    getDatas();
  }, [])
  const chartData = prepareChartData(datas);

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md">
      {loading ? <Spinner /> : ""}
      <h3 className="text-xl font-bold mb-4">Number of post shares by category (Top 10 + Others)</h3>
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
