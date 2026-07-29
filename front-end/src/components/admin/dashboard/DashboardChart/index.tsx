import styles from "./DashboardChart.module.css";

const monthlyData = [
  { month: "Jan", value: 42 },
  { month: "Fev", value: 68 },
  { month: "Mar", value: 55 },
  { month: "Abr", value: 90 },
  { month: "Mai", value: 73 },
  { month: "Jun", value: 82 },
];

export default function AdmDashboardChart() {
  return (
    <section className={styles.chart}>
      <header className={styles.header}>
        <div>
          <h2>Atividade do Museu</h2>
          <span>Eventos cadastrados nos últimos meses</span>
        </div>

        <div className={styles.summary}>
          <strong>410</strong>
          <small>Total de registros</small>
        </div>
      </header>

      <div className={styles.fakeChart}>
        {monthlyData.map((item) => (
          <div
            key={item.month}
            className={styles.barGroup}
          >
            <div
              className={styles.bar}
              style={{ height: `${item.value}%` }}
              title={`${item.value} eventos`}
            />

            <span>{item.month}</span>
          </div>
        ))}
      </div>
    </section>
  );
}