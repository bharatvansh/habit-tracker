const { contextBridge, ipcRenderer } = require('electron');

// Expose safe APIs to the renderer process via contextBridge
// This maintains security while allowing controlled communication between processes
contextBridge.exposeInMainWorld('electronAPI', {
  // Platform information
  platform: process.platform,
  
  // Safe IPC methods for future use
  // Example: send a message to main process
  send: (channel, data) => {
    const validChannels = ['app:minimize', 'app:maximize', 'app:close'];
    if (validChannels.includes(channel)) {
      ipcRenderer.send(channel, data);
    }
  },
  
  // Example: receive a message from main process
  receive: (channel, callback) => {
    const validChannels = ['app:update-available', 'app:theme-changed'];
    if (validChannels.includes(channel)) {
      ipcRenderer.on(channel, (event, ...args) => callback(...args));
    }
  },
  
  // Example: invoke a method and wait for response
  invoke: async (channel, data) => {
    const validChannels = ['app:get-version', 'app:get-settings'];
    if (validChannels.includes(channel)) {
      return await ipcRenderer.invoke(channel, data);
    }
    return null;
  }
});
