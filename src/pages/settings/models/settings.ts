export interface SystemSettingsData {
  companyName: string;
  nuit: string;
  contact: string;
  address: string;
  currency: string;
  language: string;
  timezone: string;
  logoDataUrl?: string;
}

export interface PrintSettingsData {
  printerType: 'thermal' | 'network' | 'system';
  receiptLayout: 'standard' | 'compact' | 'detailed';
  showLogo: boolean;
  showNuit: boolean;
  showAddress: boolean;
  thermalSize: '58mm' | '80mm';
  customReceiptMessage?: string;
}

export interface IntegrationsData {
  scaleType: 'none' | 'serial' | 'usb';
  scalePort?: string;
  printerIp?: string;
  scannerType: 'keyboard' | 'serial';
  scannerPort?: string;
  cashDrawerType: 'printer' | 'usb';
  cashDrawerPort?: string;
  apiEnabled: boolean;
  webhookUrl?: string;
  apiKey?: string;
}

const getStorage = <T>(key: string, defaultValue: T): T => {
  const data = localStorage.getItem(key);
  try {
    return data ? JSON.parse(data) : defaultValue;
  } catch {
    return defaultValue;
  }
};

const setStorage = <T>(key: string, data: T) => {
  localStorage.setItem(key, JSON.stringify(data));
};

export const STORAGE_KEYS = {
  SYSTEM: 'gams_settings_system',
  PRINT: 'gams_settings_print',
  INTEGRATIONS: 'gams_settings_integrations',
};

const defaultSystemSettings: SystemSettingsData = {
  companyName: 'Talho Gams EI',
  nuit: '123456789',
  contact: '+258 84 123 4567',
  address: 'Rua Principal, Montepuez',
  currency: 'MZN',
  language: 'pt-PT',
  timezone: 'Africa/Maputo',
};

const defaultPrintSettings: PrintSettingsData = {
  printerType: 'system',
  receiptLayout: 'standard',
  showLogo: true,
  showNuit: true,
  showAddress: true,
  thermalSize: '80mm',
};

const defaultIntegrations: IntegrationsData = {
  scaleType: 'none',
  scalePort: '',
  printerIp: '',
  scannerType: 'keyboard',
  cashDrawerType: 'printer',
  apiEnabled: false,
};

export const getSystemSettings = () => getStorage(STORAGE_KEYS.SYSTEM, defaultSystemSettings);
export const saveSystemSettings = (data: SystemSettingsData) => setStorage(STORAGE_KEYS.SYSTEM, data);

export const getPrintSettings = () => getStorage(STORAGE_KEYS.PRINT, defaultPrintSettings);
export const savePrintSettings = (data: PrintSettingsData) => setStorage(STORAGE_KEYS.PRINT, data);

export const getIntegrationsSettings = () => getStorage(STORAGE_KEYS.INTEGRATIONS, defaultIntegrations);
export const saveIntegrationsSettings = (data: IntegrationsData) => setStorage(STORAGE_KEYS.INTEGRATIONS, data);
