import React, { createContext, useContext, useState } from 'react';
const PlateContext = createContext({ plate: '', setPlate: (_value: string) => {} });
export function PlateProvider({ children }: { children: React.ReactNode }) {
  const [plate, updatePlate] = useState('');
  const setPlate = (value: string) => updatePlate(value.toUpperCase().replace(/[^A-Z0-9-]/g, '').slice(0, 7));
  return <PlateContext.Provider value={{ plate, setPlate }}>{children}</PlateContext.Provider>;
}
export const usePlate = () => useContext(PlateContext);
