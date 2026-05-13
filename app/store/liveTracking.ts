import { create } from 'zustand';

export interface LiveDriver {
  id: string;
  name: string;
  phone: string;
  latitude: number;
  longitude: number;
  bearing: number;
  speed: number;
  status: 'waiting' | 'accepted' | 'on_way' | 'delivered';
  orderId: string;
}

interface LiveTrackingStore {
  drivers: Map<string, LiveDriver>;
  addDriver: (driver: LiveDriver) => void;
  updateDriver: (id: string, data: Partial<LiveDriver>) => void;
  removeDriver: (id: string) => void;
  getDriver: (id: string) => LiveDriver | undefined;
}

export const useLiveTracking = create<LiveTrackingStore>((set, get) => ({
  drivers: new Map(),

  addDriver: (driver: LiveDriver) => {
    const drivers = get().drivers;
    drivers.set(driver.id, driver);
    set({ drivers: new Map(drivers) });
  },

  updateDriver: (id: string, data: Partial<LiveDriver>) => {
    const drivers = get().drivers;
    const driver = drivers.get(id);
    if (driver) {
      drivers.set(id, { ...driver, ...data });
      set({ drivers: new Map(drivers) });
    }
  },

  removeDriver: (id: string) => {
    const drivers = get().drivers;
    drivers.delete(id);
    set({ drivers: new Map(drivers) });
  },

  getDriver: (id: string) => {
    return get().drivers.get(id);
  },
}));
