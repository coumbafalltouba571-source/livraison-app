"use client";

import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface Props {
  // optionally accept data
}

export default function AdminPremiumChart(_props: Props) {
  const labels = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toLocaleDateString();
  });

  const data = {
    labels,
    datasets: [
      {
        label: "Revenu (FCFA)",
        data: Array.from({ length: 7 }).map(() => Math.floor(Math.random() * 20000)),
        borderColor: "#06b6d4",
        backgroundColor: "rgba(6,182,212,0.1)",
        tension: 0.3,
      },
    ],
  };

  return <Line data={data} options={{ responsive: true, plugins: { legend: { display: false } } }} />;
}
