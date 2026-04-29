const { app, BrowserWindow } = require('electron');
const path = require('path');

// Identifica se estamos em ambiente de desenvolvimento (React/Vite server ativo)
const isDev = process.env.NODE_ENV === 'development';

function createWindow () {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 900,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
      // Se precisar de segurança avançada em produção, ative o contextIsolation = true e crie um preload.js
    }
  });

  // Remove o menu de topo padrao do windows
  win.setMenuBarVisibility(false);

  if (isDev) {
    // Em Dev, conectamo-nos ao Vite (Localhost:3000)
    win.loadURL('http://localhost:3000');
    // Abre a Consola de Dev Tools automaticamente
    win.webContents.openDevTools();
  } else {
    // Em Produção, carregamos o ficheiro estático gerado pelo build (dist/index.html)
    win.loadFile(path.join(__dirname, 'dist', 'index.html'));
  }
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    // macOS: Se a app for ativada sem janelas visíveis, abre uma
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  // Encerra a App se não estivermos no macOS (darwin)
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
