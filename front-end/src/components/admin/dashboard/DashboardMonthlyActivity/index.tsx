import ReactECharts from "echarts-for-react";
import * as echarts from "echarts";
import { Zap } from "lucide-react";
import type { DashboardChartData } from "@/types/Dashboard";
import styles from "./DashboardMonthlyActivity.module.css";

interface Props {
  data: DashboardChartData[];
}

export default function AdmDashboardMonthlyActivity({
  data,
}: Props) {
  const maxValue = Math.max(
    ...data.map((item) => item.value),
    0
  );

  const peakItem = data.find(
    (item) => item.value === maxValue
  );

  const totalSubmissions = data.reduce(
    (sum, item) => sum + item.value,
    0
  );

  const seriesData = data.map((item) => {
    const isPeak =
      item.value === maxValue && item.value > 0;

    return {
      value: item.value,

      symbol: isPeak ? "diamond" : "circle",

      symbolSize: isPeak ? 11 : 6,

      itemStyle: {
        color: isPeak ? "#7C3AED" : "#4F6BED",
        borderColor: "#FFFFFF",
        borderWidth: 2,
        shadowColor: isPeak
          ? "rgba(124, 58, 237, 0.25)"
          : "rgba(79, 107, 237, 0.2)",
        shadowBlur: isPeak ? 6 : 3,
      },
    };
  });

  const option = {
    animation: true,
    animationDuration: 1200,
    animationDurationUpdate: 800,
    animationEasing: "cubicOut",
    animationEasingUpdate: "cubicInOut",

    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "line",
        lineStyle: {
          color: "rgba(79, 107, 237, 0.2)",
          width: 1,
        },
      },
      backgroundColor: "#1C1A19",
      borderWidth: 0,
      padding: [8, 12],
      textStyle: { color: "#F0EBE6", fontSize: 12 },
      extraCssText:
        "border-radius: 8px; box-shadow: 0 4px 16px rgba(0,0,0,0.18);",
      formatter(params: any) {
        const item = params[0];
        return `
      <div style="font-weight:600;margin-bottom:2px;color:#F0EBE6">${item.axisValue}</div>
      <div style="color:#A39B93;font-size:11px">
        Submissões: <strong style="color:#C4A574">${item.value}</strong>
      </div>
    `;
      },
    },

    grid: {
      left: 10,
      right: 16,
      top: 18,
      bottom: 4,
      containLabel: true,
    },

    xAxis: {
      type: "category",

      data: data.map((item) => item.label),

      boundaryGap: false,

      axisLine: {
        show: false,
      },

      axisTick: {
        show: false,
      },

      axisLabel: {
        color: "#8A827A",
        fontSize: 11,
        fontWeight: 500,
        margin: 12,
      },
    },

    yAxis: {
      type: "value",
      show: false,

      min: 0,

      splitLine: {
        show: false,
      },
    },

    series: [
      {
        type: "line",

        smooth: 0.45,

        data: seriesData,

        symbol: "circle",

        showSymbol: true,

        symbolSize: 6,

        lineStyle: {
          width: 3,
          color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
            { offset: 0, color: "#4F6BED" },
            { offset: 0.55, color: "#6366F1" },
            { offset: 1, color: "#7C3AED" },
          ]),
        },

        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: "rgba(79, 107, 237, 0.18)" },
            { offset: 0.55, color: "rgba(124, 58, 237, 0.06)" },
            { offset: 1, color: "rgba(124, 58, 237, 0)" },
          ]),
        },

        emphasis: {
          focus: "series",

          scale: true,

          itemStyle: {
            color: "#8B5CF6",

            borderColor: "#FFFFFF",

            borderWidth: 3,

            shadowColor:
              "rgba(139, 92, 246, 0.45)",

            shadowBlur: 14,
          },
        },

        // Pequena animação de entrada dos pontos
        animationDelay: (idx: number) =>
          idx * 70,

        animationDuration: 900,

        animationEasing: "cubicOut",
      },
    ],
  };

  return (
    <section className={styles.containerCard}>
      <header className={styles.header}>
        <div className={styles.headerTitleGroup}>
          <div className={styles.titleBadge}>
            <span className={styles.activityIcon}>
              <Zap size={17} />
            </span>

            <h2 className={styles.title}>
              Movimentação da Plataforma
            </h2>
          </div>

          <p className={styles.subtitle}>
            Volume de submissões ao longo do período
          </p>
        </div>

        <div className={styles.statsGroup}>
          <div className={styles.statInline}>
            <span className={styles.statLabel}>
              Total
            </span>

            <strong className={styles.statValue}>
              {totalSubmissions}
            </strong>
          </div>

          {peakItem && (
            <div
              className={`${styles.statInline} ${styles.peakStat}`}
            >
              <div className={styles.peakLabelGroup}>
                <Zap size={13} />

                <span className={styles.statLabel}>
                  Pico ({peakItem.label})
                </span>
              </div>

              <strong className={styles.peakValue}>
                {peakItem.value}
              </strong>
            </div>
          )}
        </div>
      </header>

      <div className={styles.chartWrapper}>
        <div className={styles.chart}>
          <ReactECharts
            option={option}
            style={{
              width: "100%",
              height: 190,
            }}
            opts={{
              renderer: "svg",
            }}
          />
        </div>
      </div>
    </section>
  );
}

