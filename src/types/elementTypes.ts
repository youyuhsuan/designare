interface BaseElement {
  id: string;
  type: string;
  label: string;
}

interface InputElement extends BaseElement {
  type: "input";
  inputType: "text" | "number" | "email" | "password" | "tel";
  placeholder?: string;
  defaultValue?: string | number;
  validation?: {
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    pattern?: string;
  };
}

interface SelectElement extends BaseElement {
  type: "select";
  options: Array<{ value: string; label: string }>;
  multiple?: boolean;
  defaultValue?: string | string[];
}

interface DateElement extends BaseElement {
  type: "date";
  format?: string;
  minDate?: string;
  maxDate?: string;
  defaultValue?: string;
}

interface FileUploadElement extends BaseElement {
  type: "file";
  accept?: string;
  multiple?: boolean;
  maxSize?: number;
}

interface ImageElement extends BaseElement {
  type: "image";
  src: string;
  alt?: string;
  width?: number;
  height?: number;
}

interface ButtonElement extends BaseElement {
  type: "button";
  action: "submit" | "reset" | "custom";
  customAction?: () => void;
}

interface TableElement extends BaseElement {
  type: "table";
  columns: Array<{ key: string; header: string }>;
  dataSource: string; // API endpoint or data reference
  pagination?: {
    pageSize: number;
    totalItems: number;
  };
}

interface ChartElement extends BaseElement {
  type: "chart";
  chartType: "bar" | "line" | "pie" | "scatter";
  dataSource: string;
  options?: any; // Chart specific options
}

interface ContainerElement extends BaseElement {
  type: "container";
  children: Array<Element>;
  layout: "vertical" | "horizontal" | "grid";
  styles?: {
    padding?: string;
    margin?: string;
    backgroundColor?: string;
  };
}

interface LabelElement extends BaseElement {
  type: "label";
  forElement?: string;
  styles?: {
    fontSize?: string;
    fontWeight?: string;
    color?: string;
  };
}

type Elements =
  | InputElement
  | SelectElement
  | DateElement
  | FileUploadElement
  | ImageElement
  | ButtonElement
  | TableElement
  | ChartElement
  | ContainerElement
  | LabelElement;

// 頁面定義
interface PageDefinition {
  id: string;
  name: string;
  elements: Element[];
  layout: {
    type: "fixed" | "responsive";
    columns?: number;
  };
}
