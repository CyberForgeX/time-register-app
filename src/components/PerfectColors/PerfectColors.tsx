import React from "react";

interface Props {
  hexColor: string;
}

const PerfectColors: React.FC<Props> = ({ hexColor }: Props) => {
  const contrastColor = useContrastColor(hexColor);

  return (
    <div style={{ backgroundColor: hexColor || "#FFFFFF", color: contrastColor }}>
      <Clock />
    </div>
  );
};

const Clock: React.FC = () => {
  const [date, setDate] = React.useState<Date>(new Date());

  React.useEffect(() => {
    const timerID = setInterval(() => tick(), 1000);
    return () => clearInterval(timerID);
  }, []);

  const tick = () => {
    setDate(new Date());
  };

  return (
    <div>
      <h2>
        {date.toLocaleDateString()} {date.toLocaleTimeString()}
      </h2>
    </div>
  );
};

const useContrastColor = (hexColor: string): string => {
  const [contrastColor, setContrastColor] = React.useState<string>("");

  React.useEffect(() => {
    let color = hexColor;
    if (!color || !/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color)) {
      color = "#FFFFFF"; // default to white if hexColor is invalid
    }

    // If a leading # is provided, remove it
    if (color.slice(0, 1) === "#") {
      color = color.slice(1);
    }

    // Convert to RGB value
    const r = parseInt(color.substr(0, 2), 16);
    const g = parseInt(color.substr(2, 2), 16);
    const b = parseInt(color.substr(4, 2), 16);

    // Calculate contrast ratio
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    const contrast = luminance > 0.5 ? "black" : "white";

    setContrastColor(contrast);
  }, [hexColor]);

  return contrastColor;
};

PerfectColors.getInitialProps = async () => {
  return { hexColor: "#222" }; // set a default hexColor for server rendering
};

export default PerfectColors;