import { PaintBrushIcon } from "@heroicons/react/24/outline";
import {
  IconButton,
  Slider,
  SpeedDial,
  SpeedDialContent,
  SpeedDialHandler,
} from "@material-tailwind/react";

interface PaintBrushProps {
  value: number;
  setValue: (lineWidth: number) => void;
}

export default function PaintBrush({ value, setValue }: PaintBrushProps) {
  return (
    <div className="tool-primary">
      <SpeedDial placement="top" className="w-full h-full">
        <SpeedDialHandler>
          <IconButton variant="gradient" className="tool-button">
            <PaintBrushIcon className="tool-icon" />
          </IconButton>
        </SpeedDialHandler>
        <SpeedDialContent >
          <Slider
            defaultValue={value}
            onChange={(e) => {
              setValue(parseInt(e.target.value));
            }}
            min={5}
            max={50}
          />
        </SpeedDialContent>
      </SpeedDial>
    </div>
  );
}
