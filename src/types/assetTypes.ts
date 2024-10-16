interface AssetTypeBase {
  name: string;
  type: string;
  icon: string;
}

interface AssetTypeWrite extends AssetTypeBase {
  description: string;
  properties: PropertyWrite[];
  styles: StyleWrite[];
}

interface AssetType extends AssetTypeBase {
  id: string;
  description: string;
  properties: Property[];
  styles: Style[];
}

interface PropertyBase {
  name: string;
  type: string;
  required: boolean;
  default_value: string;
  options: string[];
}

interface PropertyWrite extends PropertyBase {}

interface Property extends PropertyBase {
  id: string;
}

interface StyleBase {
  style_key: string;
  default_value: string;
}

interface StyleWrite extends StyleBase {}

interface Style extends StyleBase {
  id: string;
}

interface AssetRootWrite {
  assetTypes: AssetTypeWrite[];
}

interface AssetRoot {
  assetTypes: AssetType[];
}

interface AssetTypeBasic extends AssetTypeBase {
  id: string;
}

export type {
  AssetTypeBase,
  AssetType,
  PropertyBase,
  Property,
  StyleBase,
  Style,
  AssetRootWrite,
  AssetRoot,
  AssetTypeBasic,
};
