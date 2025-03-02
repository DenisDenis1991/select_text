export type Label = {
  color: string
  label: string
}

export type TextLabel = {
  start: number // начало фрагмента
  end: number // конец фрагмента
  label: string // метка
}

export type TextLabelingProps = {
  labels: Label[]
  text: string
  labeling: TextLabel[]
  onChange: (textLabels: TextLabel[]) => void;
} 

export enum LabelColors {
  'ФИО' = 'rgb(89, 240, 142)',
  'Дата' = 'rgb(110, 187, 255)',
  'Тип' = 'rgb(245, 84, 84)',
}