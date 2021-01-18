import { useMemo } from "react";

let counter = 0;

const useGenerateId = () => {
  const id = useMemo(() => ++counter, []);

  return (suffix: string | number) => `id${id}_${suffix}`;
};

export default useGenerateId;
