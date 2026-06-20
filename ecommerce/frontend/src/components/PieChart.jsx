//ecommerce/frontend/src/components/PieChart.jsx
import { PieChart, pieClasses, pieArcClasses } from "@mui/x-charts/PieChart";
import { rainbowSurgePalette } from "@mui/x-charts/colorPalettes";
import { useTheme } from "@mui/material/styles";
import { Box, Typography } from "@mui/material";

const DonutPieChart = ({
  title,
  data,
  height = 260,
  innerRadius = 100,
  outerRadius = 120,
}) => {
  const theme = useTheme();
  const palette = rainbowSurgePalette(theme.palette.mode);

  const formattedData = data.map((item, index) => ({
    ...item,
    color: item.color ?? palette[index % palette.length],
  }));

  const chartSettings = {
    series: [
      {
        id: "main",
        innerRadius,
        outerRadius,
        data: formattedData,
        highlightScope: { highlight: "item", fade: "global" },
      },
    ],
    height,
    hideLegend: true,
  };

  return (
    <Box
      sx={{
        backgroundColor: "background.paper",
        borderRadius: 2,
        boxShadow: 1,
        p: 2,
        height: "100%",
      }}
    >
      {title && (
        <Typography variant="h6" fontWeight={600} mb={1.5}>
          {title}
        </Typography>
      )}

      <PieChart {...chartSettings} sx={{ mx: "auto" }} />

      {/* Custom Legend */}
      <Box mt={2}>
        {formattedData.map((item, index) => (
          <Box
            key={index}
            display="flex"
            alignItems="center"
            justifyContent="center"
            mb={0.5}
          >
            <Box
              sx={{
                width: 12,
                height: 12,
                borderRadius: "50%",
                backgroundColor: item.color,
                mr: 1,
              }}
            />
            <Typography variant="body2">
              {item.label}: {item.value}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default DonutPieChart;
