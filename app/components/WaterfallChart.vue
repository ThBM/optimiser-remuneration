<script lang="ts" setup>
import { ref, onMounted, watch } from "vue";
import * as echarts from "echarts";

const props = defineProps<{
  budgetTotal: number;
  salaireBrut: number;
  chargesSocialesPatronales: number;
  dividendesBrut: number;
  impotSociete: number;
  csgDividendes: number;
  impotRevenu: number;
  remunerationNette: number;
}>();

const chartRef = ref<HTMLDivElement | null>(null);
let chartInstance: echarts.ECharts | null = null;

const formatEuro = (montant: number) => {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(montant);
};

const initChart = () => {
  if (!chartRef.value) return;

  // Détruire l'instance précédente si elle existe
  if (chartInstance) {
    chartInstance.dispose();
  }

  chartInstance = echarts.init(chartRef.value);

  // Calcul des valeurs pour le waterfall
  // On part du budget total et on déduit chaque coût jusqu'à la rémunération nette
  const data = [
    {
      name: "Budget total",
      value: props.budgetTotal,
      itemStyle: { color: "#6366f1" }, // indigo
    },
    {
      name: "Charges sociales\npatronales",
      value: -props.chargesSocialesPatronales,
      itemStyle: { color: "#ef4444" }, // rouge
    },
    {
      name: "Impôt sur\nles sociétés",
      value: -props.impotSociete,
      itemStyle: { color: "#f97316" }, // orange
    },
    {
      name: "CSG\ndividendes",
      value: -props.csgDividendes,
      itemStyle: { color: "#f59e0b" }, // ambre
    },
    {
      name: "Impôt sur\nle revenu",
      value: -props.impotRevenu,
      itemStyle: { color: "#eab308" }, // jaune
    },
    {
      name: "Rémunération\nnette",
      value: props.remunerationNette,
      itemStyle: { color: "#22c55e" }, // vert
    },
  ];

  // Calcul des positions pour simuler un waterfall
  const assistData: (number | string)[] = [];
  let cumul = 0;

  data.forEach((item, index) => {
    if (index === 0) {
      // Premier élément (Budget total)
      assistData.push(0);
      cumul = item.value;
    } else if (index === data.length - 1) {
      // Dernier élément (Rémunération nette)
      assistData.push(0);
    } else {
      // Éléments intermédiaires (coûts)
      cumul += item.value;
      assistData.push(cumul);
    }
  });

  const option: echarts.EChartsOption = {
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
      },
      formatter: (params: echarts.TooltipComponentFormatterCallbackParams) => {
        if (!Array.isArray(params) || params.length === 0) return "";
        const firstParam = params[0];
        if (!firstParam) return "";
        const dataIndex = firstParam.dataIndex;
        if (dataIndex === undefined) return "";
        const item = data[dataIndex];
        if (!item) return "";
        const absoluteValue = Math.abs(item.value);
        return `<strong>${item.name.replace("\n", " ")}</strong><br/>${formatEuro(absoluteValue)}`;
      },
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "3%",
      top: "10%",
      containLabel: true,
    },
    xAxis: {
      type: "category",
      data: data.map((item) => item.name),
      axisLabel: {
        interval: 0,
        fontSize: 12,
      },
    },
    yAxis: {
      type: "value",
      axisLabel: {
        formatter: (value: number) => {
          return formatEuro(value);
        },
      },
    },
    series: [
      {
        name: "Assist",
        type: "bar",
        stack: "Total",
        itemStyle: {
          borderColor: "transparent",
          color: "transparent",
        },
        emphasis: {
          itemStyle: {
            borderColor: "transparent",
            color: "transparent",
          },
        },
        data: assistData,
      },
      {
        name: "Montant",
        type: "bar",
        stack: "Total",
        label: {
          show: true,
          position: "inside",
          formatter: (params: echarts.DefaultLabelFormatterCallbackParams) => {
            if (typeof params.value !== "number") return "";
            const value = Math.abs(params.value);
            if (value < props.budgetTotal * 0.05) {
              return ""; // Ne pas afficher les petites valeurs
            }
            return formatEuro(value);
          },
          fontSize: 11,
          color: "#fff",
          fontWeight: "bold",
        },
        data: data.map((item, index) => {
          if (index === data.length - 1) {
            // Dernier élément : on affiche la valeur absolue
            return {
              value: item.value,
              itemStyle: item.itemStyle,
            };
          }
          return {
            value: Math.abs(item.value),
            itemStyle: item.itemStyle,
          };
        }),
      },
    ],
  };

  chartInstance.setOption(option);

  // Gestion du redimensionnement
  const resizeObserver = new ResizeObserver(() => {
    chartInstance?.resize();
  });
  resizeObserver.observe(chartRef.value);
};

onMounted(() => {
  initChart();
});

watch(
  () => [
    props.budgetTotal,
    props.chargesSocialesPatronales,
    props.impotSociete,
    props.csgDividendes,
    props.impotRevenu,
    props.remunerationNette,
  ],
  () => {
    initChart();
  },
);
</script>

<template>
  <div ref="chartRef" class="w-full h-96" />
</template>
