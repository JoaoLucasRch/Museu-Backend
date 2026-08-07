import ReactECharts from "echarts-for-react";
import * as echarts from "echarts";
import { Layers } from "lucide-react";
import type { DashboardTopEvent } from "@/types/Dashboard";
import styles from "./DashboardTopEvents.module.css";

interface Props {
  data: DashboardTopEvent[];
}

// Gradientes coloridos e vibrantes para o ranking (do 1º ao 5º)
const GRADIENTS = [
  { start: "#4F6BED", end: "#7C3AED" }, // 1º
  { start: "#3B82F6", end: "#0EA5E9" }, // 2º
  { start: "#059669", end: "#10B981" }, // 3º
  { start: "#B27A35", end: "#D97706" }, // 4º
  { start: "#7C3AED", end: "#A855F7" }, // 5º
];

export default function AdmDashboardTopEvents({ data }: Props) {
  const events = data.slice(0, 5);

  const option = {
    animation: true,
    animationDuration: 1000,
    animationDelay: (idx: number) => idx * 120,
    animationEasing: "cubicOut",
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
        shadowStyle: { color: "rgba(79, 107, 237, 0.04)" },
        emphasis: {
          focus: "series",
          itemStyle: {
            shadowBlur: 14,
            shadowColor: "rgba(79,107,237,.28)",
          },
        },
      },
      backgroundColor: "#1C1A19",
      borderWidth: 0,
      padding: [8, 12],
      textStyle: { color: "#F0EBE6", fontSize: 12 },
      extraCssText: "border-radius: 8px; box-shadow: 0 4px 16px rgba(0,0,0,0.18);",
      formatter(params: any) {
        const item = params[0];
        return `
      <div style="font-weight:600;margin-bottom:2px;color:#F0EBE6">${item.name}</div>
      <div style="color:#A39B93;font-size:11px">
        Total de submissões: <strong style="color:#C4A574">${item.value}</strong>
      </div>
    `;
      },
    },

    grid: {
      left: 10,
      right: 48,
      top: 12,
      bottom: 0,
      containLabel: true,
    },

    xAxis: {
      type: "value",
      show: false,
    },

    yAxis: {
      type: "category",
      inverse: true,
      data: events.map((item) => item.titulo),
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: {
        color: "#6B635C",
        fontSize: 12,
        fontWeight: 500,
        width: 170,
        overflow: "truncate",
        ellipsis: "...",
      },
    },

    series: [
      {
        type: "bar",
        barWidth: 14,
        showBackground: true,
        backgroundStyle: {
          color: "#F7F3EF",
          borderRadius: [0, 6, 6, 0],
        },
        label: {
          show: true,
          position: "right",
          distance: 10,
          color: "#1C1A19",
          fontWeight: 650,
          fontSize: 12,
        },
        data: events.map((item, index) => {
          const colors = GRADIENTS[index % GRADIENTS.length];
          return {
            value: item.total,
            itemStyle: {
              borderRadius: [0, 6, 6, 0],
              color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                { offset: 0, color: colors.start },
                { offset: 1, color: colors.end },
              ]),
            },
          };
        }),
      },
    ],
  };

  return (
    <section className={styles.containerCard}>
      <header className={styles.header}>
        <div>
          <h2 className={styles.title}>
            Eventos mais procurados
          </h2>

          <p className={styles.subtitle}>
            Ranking por volume de submissões
          </p>
        </div>
      </header>

      {events.length === 0 ? (
        <div className={styles.emptyState}>
          <Layers size={22} />
          <span>Nenhum evento registrado.</span>
        </div>
      ) : (
        <div className={styles.content}>
          {/* Indicadores numéricos das posições (Ranking Visual) */}
          <div className={styles.rankBadges}>
            {events.map((_, index) => (
              <span
                key={index}
                className={`${styles.rankBadge} ${styles[`rank${index + 1}`]}`}
              >
              </span>
            ))}
          </div>

          {/* Gráfico */}
          <div className={styles.chartWrapper}>
            <ReactECharts
              option={option}
              style={{ width: "100%", height: 230 }}
              opts={{ renderer: "svg" }}
            />
          </div>
        </div>
      )}
    </section>
  );
}