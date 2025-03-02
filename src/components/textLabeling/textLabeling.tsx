import cls from './textLabeling.module.scss'
import { Card, Radio, RadioChangeEvent } from 'antd';
import { useMemo, useState } from 'react';
import clsx from 'clsx';
import { Label, LabelColors, TextLabel, TextLabelingProps } from '@/shared/types';

const calculateTotalLength = (selectedSpan: Element): number => {
  let totalLength = 0;
  let previousSpan = selectedSpan.previousElementSibling;
  while (previousSpan) {
    totalLength += previousSpan?.textContent?.length || 0;
    previousSpan = previousSpan.previousElementSibling;
  }
  return totalLength;
}

const checkOverlap = (labeling: TextLabel[], start: number, end: number): boolean => {
  return labeling.some(
    (label) =>
      (start>end) ||
      (start >= label.start && start < label.end) ||
      (end > label.start && end <= label.end) ||
      (start <= label.start && end >= label.end)
  );
}

const createNewLabeling = (
  labeling: TextLabel[],
  start: number,
  end: number,
  label: string
): TextLabel[] => {
  return [...labeling, { start, end, label }];
}

const renderText = (text: string, labeling: TextLabel[]): React.ReactNode[] => {
  const sortedLabeling = [...labeling].sort((a, b) => a.start - b.start);
  const elements: React.ReactNode[] = [];
  if (sortedLabeling.length === 0) elements.push(<span key={Date.now()}>{text}</span>);
  sortedLabeling.forEach((label, index, arr) => {
    // Текст до первой метки
    if (index === 0 && label.start > 0) {
      elements.push(
        <span key={`text-before-${label.start}`}>
          {text.slice(0, label.start)}
        </span>
      );
    }

    // Текст между метками
    if (index > 0 && label.start > arr[index - 1].end) {
      elements.push(
        <span key={`text-between-${label.start}`}>
          {text.slice(arr[index - 1].end, label.start)}
        </span>
      );
    }

    // Текст с меткой
    elements.push(
      <span
        style={{ backgroundColor: LabelColors[label.label as keyof typeof LabelColors] }}
        key={`label-${label.start}`}
      >
        {text.slice(label.start, label.end)}
      </span>
    );

    // Текст после последней метки
    if (index === arr.length - 1 && label.end < text.length) {
      elements.push(
        <span key={`text-after-${label.start}`}>
          {text.slice(label.end, text.length)}
        </span>
      );
    }
  });

  return elements;
}

export const TextLabeling: React.FC<TextLabelingProps> = ({
  labels,
  text,
  labeling,
  onChange
}) => {

  const [selectedLabel, setSelectedLabel] = useState<Label | null>(null);
  const handleTextSelect = () => {
    const selection = window.getSelection();

    if (selection && selection.rangeCount > 0 && selectedLabel) {
      const range = selection.getRangeAt(0);
      const selectedSpan = range.startContainer.parentElement;
      const startSelectedIndex = range.startOffset;
      const endSelectedIndex = range.endOffset;
      console.log(startSelectedIndex, endSelectedIndex);
      if (selectedSpan) {
        let totalLength = calculateTotalLength(selectedSpan);
        const start = totalLength + startSelectedIndex;
        if (startSelectedIndex > endSelectedIndex) totalLength = 0;
        const end = totalLength + endSelectedIndex;
        console.log(checkOverlap(labeling, start, end), start, end);
        if (!checkOverlap(labeling, start, end)) {
          const newLabeling = createNewLabeling(labeling, start, end, selectedLabel.label);
          onChange(newLabeling);
        } else {
          alert('Выделенный фрагмент пересекается с уже размеченным текстом.');
        }
      }
    }
  }

  const handleChange = (e: RadioChangeEvent) => {
    const { value, name } = e.target;
    setSelectedLabel({ color: value, label: name as string });
  };

  const memoizedRenderText = useMemo(() => {
    return renderText(text, labeling);
  }, [text, labeling]);

  return (
    <div className={clsx(cls.card)}>
      <Card title="Документ" variant="borderless">
        <div onMouseUp={handleTextSelect}>
          {memoizedRenderText}
        </div>
      </Card>
      <Card title="Метки" variant="borderless">
        <ul className={clsx(cls.card__list, cls.list)}>
          {labels.map((el) =>
            <li key={el.color}>
              <Radio.Group
                options={[{ label: el.label, value: el.label }]}
                optionType="button"
                name={el.label}
                onChange={handleChange}
                buttonStyle="solid"
                value={selectedLabel?.label}
                className={clsx(cls.list__title, cls[`select__title_${el.color}`])}
              />
            </li>
          )}
        </ul>
      </Card>
    </div>
  )
}