import { selectLabelList, TEXT } from "@/shared/const"
import { useState } from "react";
import { TextLabel } from "@/shared/types";
import { TextLabeling } from "../textLabeling/textLabeling";

// const initialLabeling = [
//   { start: 0, end: 7, label: 'ФИО' },
// ];

export const Card = () => {
  const [labeling, setLabeling] = useState<TextLabel[]>([]);

  const onChange = (labeling: TextLabel[]) => {
    setLabeling(labeling)
  }

  return (
    <div>
      <TextLabeling
        labels={selectLabelList}
        text={TEXT}
        labeling={labeling}
        onChange={onChange}
      />
    </div>
  )
}