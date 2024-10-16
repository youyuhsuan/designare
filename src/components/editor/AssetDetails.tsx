import React, { useEffect } from "react";
import { AssetType } from "@/src/types/assetTypes";
import { motion, Variants } from "framer-motion";
import styled from "styled-components";
import { useQuery } from "@tanstack/react-query";

interface AssetDetailsProps {
  expandedContentVariants: Variants;
  assetName: string;
}

const SubItems = styled(motion.div)`
  padding: 10px;
  background-color: ${(props) => props.theme.colors.backgroundColor};
  box-shadow: 0 2px 5px ${(props) => props.theme.colors.shadow};
`;

const SubItem = styled(motion.div)`
  margin-bottom: 5px;
`;

// Fetch asset by name GET API
export const fetchByNameAsset = async (name: string): Promise<AssetType> => {
  const response = await fetch(`/api/assets?name=${encodeURIComponent(name)}`);
  const data = await response.json();
  if (!response.ok) {
    throw new Error(`Fetch asset failed with status:${response.status}`);
  }
  return data;
};

const AssetDetails: React.FC<AssetDetailsProps> = ({
  expandedContentVariants,
  assetName,
}) => {
  const {
    data: asset,
    error,
    isLoading,
  } = useQuery<AssetType, Error>({
    queryKey: ["asset", assetName],
    queryFn: () => fetchByNameAsset(assetName),
    enabled: !!assetName,
    retry: 1,
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <SubItems variants={expandedContentVariants}>
      {asset?.properties && asset.properties.length > 0 && (
        <div>
          <h4>Properties:</h4>
          {asset.properties.map((prop, index) => (
            <SubItem
              key={prop.id || index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ delay: index * 0.1 }}
            >
              {prop.name}: {prop.default_value}
            </SubItem>
          ))}
        </div>
      )}
      {asset?.styles && asset.styles.length > 0 && (
        <div>
          <h4>Styles:</h4>
          {asset.styles.map((style, index) => (
            <SubItem
              key={style.id || index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ delay: index * 0.1 }}
            >
              {style.id}: {style.default_value}
            </SubItem>
          ))}
        </div>
      )}
    </SubItems>
  );
};

export default AssetDetails;
