import api from "@/services/api";

import type { DashboardData } from "@/types/Dashboard";

export class DashboardService {

  static async getDashboard() {

    const { data } =
      await api.get<DashboardData>(
        "/dashboard"
      );

    return data;
  }

}