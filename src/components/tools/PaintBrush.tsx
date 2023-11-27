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
          <IconButton size="lg" className="tool-button">
            <PaintBrushIcon className="tool-icon" />
          </IconButton>
        </SpeedDialHandler>
        <SpeedDialContent className="rounded-full p-2 bg-white border-2 border-white shadow-xl shadow-black/10 flex justify-center items-center">
          <Slider
            className="w-12 h-4"
            size="md"
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
