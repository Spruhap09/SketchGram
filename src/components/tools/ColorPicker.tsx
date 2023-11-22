import { PlusCircleIcon, SwatchIcon } from "@heroicons/react/24/outline";
import {
  IconButton,
  SpeedDial,
  SpeedDialContent,
  SpeedDialHandler,
} from "@material-tailwind/react";
import { GithubPicker } from "react-color";
import { useState } from "react";

interface ColorPickerProps {
  color: string;
  setColor: (color: string) => void;
}

export default function ColorPicker({ color, setColor }: ColorPickerProps) {
  const [clicked, setClicked] = useState(false);

  return (
    <div className="tool-primary">
      <SpeedDial placement="bottom">
        <SpeedDialHandler>
          <IconButton size="lg" className="tool-button">
            <SwatchIcon className="tool-icon" />
          </IconButton>
        </SpeedDialHandler>
        <SpeedDialContent className="dial-content">
          <GithubPicker
            className="w-12 h-24"
            color={color}
            onChange={(e) => setColor(e.hex)}
            colors={[
              "#000000FF", // black
              "#FFFFFFFF", // white
              "#FF0000FF", // red
              "#FFA500FF", // orange
              "#FFFF00FF", // yellow
              "#00FF00FF", // green
              "#0000FFFF", // blue
              "#4B0082FF", // indigo
              "#7F00FFFF", // violet
              "#8B0000FF", // dark red
              "#023020FF", // dark green
              "#FF7276FF", // light red
              "#90EE90FF", // light green
              "#00008BFF", // dark blue
              "#8B8000FF", // dark yellow (gold)
              "#BBEAFFFF", // pastel blue
              "#FDFD96FF", // pastel yellow
              "#C3B1E1FF", // pastel purple
              "#F8C8DCFF", // pastel pink
              "#77DD77FF", // pastel green
              "#FAC898FF", // pastel orange
            ]}
          />
        </SpeedDialContent>
      </SpeedDial>
    </div>
  );
}
