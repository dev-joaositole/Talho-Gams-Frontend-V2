import React, { createContext, useContext, useEffect, useState } from 'react';
import { dictionary } from './dictionary';

type Language = 'pt' | 'en';
type Theme = 'light' | 'dark';

interface SettingsContextData {
  language: Language;
  setLanguage: (lang: Language) => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  t: (key: string) => string;
}

const SettingsContext = createContext<SettingsContextData>({} as SettingsContextData);

function getTextNodesIn(node: Node, textNodes: Node[] = []) {
  if (node.nodeType === Node.TEXT_NODE) {
    if (node.nodeValue?.trim() !== '') {
      textNodes.push(node);
    }
  } else if (node.nodeType === Node.ELEMENT_NODE) {
    const el = node as Element;
    if (el.tagName !== 'SCRIPT' && el.tagName !== 'STYLE' && el.tagName !== 'NOSCRIPT') {
      for (let child = node.firstChild; child; child = child.nextSibling) {
        getTextNodesIn(child, textNodes);
      }
    }
  }
  return textNodes;
}

function translateDOM(lang: Language) {
  if (lang !== 'en') return;

  const textNodes = getTextNodesIn(document.body);
  const sortedKeys = Object.keys(dictionary).sort((a, b) => b.length - a.length);

  for (const node of textNodes) {
    if (!node.nodeValue || !node.nodeValue.trim()) continue;
    
    let text = node.nodeValue;
    let changed = false;

    // First try exact trim match to preserve formatting
    const originalTrimmed = text.trim();
    if (dictionary[originalTrimmed]) {
      text = text.replace(originalTrimmed, dictionary[originalTrimmed]);
      changed = true;
    } else {
      // Then try partial matches
      for (const pt of sortedKeys) {
        if (text.includes(pt)) {
          // ensure we don't accidentally replace inner characters using regex boundaries if it's a small word
          if (pt.length < 5) {
             const regex = new RegExp(`\\b${pt}\\b`, 'g');
             if (regex.test(text)) {
                 text = text.replace(regex, dictionary[pt]);
                 changed = true;
             }
          } else {
             text = text.replaceAll(pt, dictionary[pt]);
             changed = true;
          }
        }
      }
    }
    
    if (changed) {
      node.nodeValue = text;
    }
  }
}

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem('gams_app_language') as Language) || 'pt';
  });
  
  const [theme, setThemeState] = useState<Theme>(() => {
    return (localStorage.getItem('gams_app_theme') as Theme) || 'light';
  });

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('gams_app_theme', theme);
  }, [theme]);

  // Hook for DOM-level auto translation for generic untouched pages
  useEffect(() => {
    if (language === 'pt') return;

    let timeout: any;
    const observer = new MutationObserver((mutations) => {
      // We bounce the translation slightly to avoid locking the UI on heavy re-renders
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        translateDOM(language);
      }, 50);
    });

    observer.observe(document.body, { childList: true, subtree: true, characterData: true });
    
    // Initial pass
    translateDOM(language);

    return () => {
      observer.disconnect();
      clearTimeout(timeout);
    };
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('gams_app_language', lang);
    window.location.reload();
  };

  const setTheme = (t: Theme) => {
    setThemeState(t);
  };

  const t = (key: string): string => {
    if (language === 'en' && dictionary[key]) {
      return dictionary[key];
    }
    return key;
  };

  return (
    <SettingsContext.Provider value={{ language, setLanguage, theme, setTheme, t }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  return useContext(SettingsContext);
}
