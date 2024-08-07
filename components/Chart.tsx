"use client";

import React, { useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Barang, SalesDet } from "@prisma/client";

const chartConfig = {
  sales: {
    label: "Sales",
    color: "hsl(var(--chart-2))",
  },
};

export function ChartComponent({
  transactions,
  products,
}: {
  transactions: SalesDet[];
  products: Barang[];
}) {
  const chartData = useMemo(() => {
    const productMap = new Map(products.map((p) => [p.id, p.nama]));
    const aggregatedData = transactions.reduce((acc, t) => {
      const productName = productMap.get(t.barang_id) || "Unknown";
      if (!acc[t.barang_id]) {
        acc[t.barang_id] = { barang_id: t.barang_id, productName, qty: 0 };
      }
      acc[t.barang_id].qty += t.qty;
      return acc;
    }, {} as Record<number, { barang_id: number; productName: string; qty: number }>);

    return Object.values(aggregatedData).sort((a, b) => b.qty - a.qty);
  }, [transactions, products]);

  return (
    <ResponsiveContainer width="100%" height={500}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="productName"
          tick={({ x, y, payload }) => (
            <g transform={`translate(${x},${y})`}>
              <text
                x={0}
                y={0}
                dy={16}
                fill="#666"
                className="hidden xl:block"
                style={{ fontSize: 12 }}
              >
                {payload.value}
              </text>
            </g>
          )}
          height={60}
          interval={0}
        />
        <YAxis />
        <Tooltip
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              return (
                <div className="bg-white p-2 border rounded shadow">
                  <p className="font-bold">{payload[0].payload.productName}</p>
                  <p>Terjual: {payload[0].value}</p>
                </div>
              );
            }
            return null;
          }}
        />
        <Legend />
        <Bar
          dataKey="qty"
          name="Jumlah Terjual"
          fill={chartConfig.sales.color}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
