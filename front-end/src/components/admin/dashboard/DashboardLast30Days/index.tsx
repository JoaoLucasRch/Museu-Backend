import ReactECharts from "echarts-for-react";
import * as echarts from "echarts";
import { CalendarDays, Layers } from "lucide-react";
import { useEffect, useRef } from "react";

import type { DashboardActivityData } from "@/types/Dashboard";

import styles from "./DashboardLast30Days.module.css";

interface Props {
  data: DashboardActivityData["resumo30Dias"];
}

const CATEGORY_PALETTES = [
  { start: "#5B6EF5", end: "#818CF8" }, // Enviadas
  { start: "#159A78", end: "#3CCFA0" }, // Aprovadas
  { start: "#D65C68", end: "#F08A92" }, // Rejeitadas
  { start: "#8A5CF6", end: "#B18AF5" }, // Expostas
];

export default function AdmDashboardLast30Days({ data }: Props) {
  const chartRef = useRef<any>(null);
  const isHovering = useRef(false);

  const chartData = [
    { name: "Enviadas", value: data.obrasEnviadas || 0 },
    { name: "Aprovadas", value: data.aprovadas || 0 },
    { name: "Rejeitadas", value: data.rejeitadas || 0 },
    { name: "Expostas", value: data.expostas || 0 },
  ];

  const totalObras = chartData.reduce(
    (sum, item) => sum + item.value,
    0
  );

  useEffect(() => {
    if (totalObras === 0) return;

    let currentIndex = 0;

    const interval = window.setInterval(() => {
      if (isHovering.current) return;

      const chart = chartRef.current?.getEchartsInstance();
      if (!chart) return;

      chart.dispatchAction({ type: "downplay", seriesIndex: 0 });
      chart.dispatchAction({
        type: "highlight",
        seriesIndex: 0,
        dataIndex: currentIndex,
      });

      currentIndex = (currentIndex + 1) % chartData.length;
    }, 3200);

    return () => window.clearInterval(interval);
  }, [totalObras, chartData.length]);

  const highlightSegment = (index: number) => {
    const chart = chartRef.current?.getEchartsInstance();
    if (!chart) return;

    isHovering.current = true;
    chart.dispatchAction({ type: "downplay", seriesIndex: 0 });
    chart.dispatchAction({
      type: "highlight",
      seriesIndex: 0,
      dataIndex: index,
    });
  };

  const resetHighlight = () => {
    const chart = chartRef.current?.getEchartsInstance();
    if (!chart) return;

    isHovering.current = false;
    chart.dispatchAction({ type: "downplay", seriesIndex: 0 });
  };

  const option = {
    animation: true,
    animationDuration: 900,
    animationEasing: "cubicOut",

    tooltip: {
      trigger: "item",
      backgroundColor: "#1C1A19",
      borderWidth: 0,
      padding: [8, 12],
      textStyle: { color: "#F0EBE6", fontSize: 12 },
      extraCssText:
        "border-radius: 8px; box-shadow: 0 4px 16px rgba(0,0,0,0.18);",
      formatter: (params: any) => `
        <div style="font-weight:600;margin-bottom:2px;color:#F0EBE6">
          ${params.name}
        </div>
        <div style="color:#A39B93;font-size:11px">
          ${params.value} obras
          <strong style="color:#C4A574;margin-left:3px">
            ${params.percent}%
          </strong>
        </div>
      `,
    },

    series: [
      {
        type: "pie",
        radius: ["67%", "88%"],
        center: ["50%", "50%"],
        startAngle: 90,
        clockwise: true,
        avoidLabelOverlap: false,
        label: { show: false },
        labelLine: { show: false },
        itemStyle: {
          borderColor: "#FFFFFF",
          borderWidth: 2,
          borderRadius: 4,
        },
        emphasis: {
          scale: true,
          scaleSize: 5,
          itemStyle: {
            shadowBlur: 12,
            shadowColor: "rgba(28, 26, 25, 0.12)",
          },
        },
        animationType: "expansion",
        animationDuration: 900,
        animationEasing: "cubicOut",
        data: chartData.map((item, index) => {
          const palette = CATEGORY_PALETTES[index];
          return {
            name: item.name,
            value: item.value,
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 1, 1, [
                { offset: 0, color: palette.start },
                { offset: 1, color: palette.end },
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
          <h2 className={styles.title}>Últimos 30 dias</h2>
          <p className={styles.subtitle}>
            Resumo e distribuição das atividades recentes
          </p>
        </div>
      </header>

      {totalObras === 0 ? (
        <div className={styles.emptyState}>
          <Layers size={20} />
          <span>Nenhuma atividade registrada no período.</span>
        </div>
      ) : (
        <div className={styles.content}>
          <div className={styles.chartWrapper}>
            <ReactECharts
              ref={chartRef}
              option={option}
              style={{ width: "170px", height: "170px" }}
              opts={{ renderer: "svg" }}
            />

            <div className={styles.centerOverlay}>
              <span className={styles.centerValue}>
                {new Intl.NumberFormat("pt-BR").format(totalObras)}
              </span>
              <span className={styles.centerLabel}>Obras</span>
            </div>
          </div>

          <div className={styles.legendContainer}>
            <div className={styles.legendList}>
              {chartData.map((item, index) => {
                const percentage =
                  totalObras > 0
                    ? Math.round((item.value / totalObras) * 100)
                    : 0;
                const palette = CATEGORY_PALETTES[index];

                return (
                  <div
                    key={item.name}
                    className={styles.legendItem}
                    onMouseEnter={() => highlightSegment(index)}
                    onMouseLeave={resetHighlight}
                  >
                    <div className={styles.legendLeft}>
                      <span
                        className={styles.dot}
                        style={{
                          background: `linear-gradient(135deg, ${palette.start}, ${palette.end})`,
                        }}
                      />
                      <span className={styles.itemLabel}>{item.name}</span>
                    </div>

                    <div className={styles.legendRight}>
                      <div className={styles.progressBarBg}>
                        <div
                          className={styles.progressBarFill}
                          style={{
                            width: `${percentage}%`,
                            background: `linear-gradient(90deg, ${palette.start}, ${palette.end})`,
                          }}
                        />
                      </div>
                      <strong className={styles.itemValue}>{item.value}</strong>
                      <span className={styles.itemPercentage}>
                        {percentage}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className={styles.eventsBadge}>
              <div className={styles.eventsIcon}>
                <CalendarDays size={17} />
              </div>
              <div className={styles.eventsText}>
                <div className={styles.eventsValueGroup}>
                  <strong>{data.eventosCriados}</strong>
                  <span>novos eventos</span>
                </div>
                <p className={styles.eventsSubtext}>
                  criados nos últimos 30 dias
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}