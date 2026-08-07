import ReactECharts from "echarts-for-react";

import styles from "./DashboardChart.module.css";

import type {
  DashboardChartData,
} from "@/types/Dashboard";

interface Props {
  title: string;
  subtitle: string;
  data?: DashboardChartData[];
  type?: "donut" | "bar";
}

export default function AdmDashboardChart({
  title,
  subtitle,
  data,
  type = "donut",
}: Props) {

  const chartData = data ?? [];

  const total = chartData.reduce(
    (sum, item) => sum + item.value,
    0
  );

  const colors = [
    "#79AEE8",
    "#7FC8A9",
    "#F2B880",
    "#B8A5E8",
    "#E9A8B5",
  ];

  const tooltip = {
    backgroundColor: "#2D231E",
    borderWidth: 0,
    textStyle: {
      color: "#FFFFFF",
      fontSize: 12,
    },
  };

  const option =
    type === "donut"
      ? {
          animation: true,
          animationDuration: 3000,
          animationEasing: "cubicOut",

          color: colors,

          tooltip: {
            trigger: "item",
            ...tooltip,
            formatter: "{b}<br/><b>{c}</b> ({d}%)",
          },

          series: [
            {
              type: "pie",

              radius: ["62%", "82%"],

              center: ["50%", "50%"],

              startAngle: 90,

              animationType: "expansion",

              animationDuration: 3000,

              animationEasing: "cubicOut",

              animationDelay: (index: number) =>
                index * 250,

              label: {
                show: false,
              },

              itemStyle: {
                borderColor: "#FFFFFF",
                borderWidth: 4,
              },

              data: chartData.map(item => ({
                name: item.label,
                value: item.value,
              })),
            },
          ],
        }
      : {
          animation: true,

          animationDuration: 2500,

          animationEasing: "cubicOut",

          animationDurationUpdate: 2500,

          animationEasingUpdate: "cubicOut",

          tooltip: {
            trigger: "axis",
            ...tooltip,
          },

          grid: {
            left: 10,
            right: 20,
            top: 10,
            bottom: 10,
            containLabel: true,
          },

          xAxis: {
            type: "value",
            show: false,
          },

          yAxis: {
            type: "category",

            data: chartData.map(item => item.label),

            axisLine: {
              show: false,
            },

            axisTick: {
              show: false,
            },

            axisLabel: {
              color: "#555",
              fontSize: 13,
            },
          },

          series: [
            {
              type: "bar",

              barWidth: 14,

              animationDuration: 2500,

              animationEasing: "cubicOut",

              animationDelay: (index: number) =>
                index * 500,

              animationDelayUpdate: (index: number) =>
                index * 500,

              data: chartData.map((item, index) => ({
                value: item.value,

                itemStyle: {
                  color: colors[index % colors.length],

                  borderRadius: [0, 8, 8, 0],
                },
              })),
            },
          ],
        };

  return (
    <section className={styles.chart}>
      <header className={styles.header}>
        <h2>{title}</h2>

        <span>{subtitle}</span>
      </header>

      {type === "donut" ? (
        <div className={styles.content}>
          <div className={styles.chartWrapper}>
            <ReactECharts
              option={option}
              style={{
                width: 180,
                height: 180,
              }}
            />

            <div className={styles.chartCenter}>
              <strong>{total}</strong>

              <span>Obras</span>
            </div>
          </div>

          <div className={styles.legend}>
            {chartData.map((item, index) => (
              <div
                key={item.label}
                className={styles.legendItem}
              >
                <div
                  className={styles.dot}
                  style={{
                    backgroundColor:
                      colors[index % colors.length],
                  }}
                />

                <span>{item.label}</span>

                <strong>{item.value}</strong>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <ReactECharts
          option={option}
          style={{
            width: "100%",
            height: 170,
          }}
        />
      )}
    </section>
  );
}