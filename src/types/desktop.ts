/**
 * @license
 * SPDX-License-Identifier: MIT
 * WebLinux Desktop & Window Manager Types
 */

export type AppId = 
  | 'terminal' 
  | 'vga' 
  | 'files' 
  | 'editor' 
  | 'sysmon' 
  | 'settings' 
  | 'packages'
  | 'docs';

export type DesktopTheme = 'dark' | 'nord' | 'dracula' | 'cyber' | 'light';

export interface AppDefinition {
  id: AppId;
  name: string;
  category: 'System' | 'Development' | 'Utilities' | 'Help';
  description: string;
  iconName: string;
  defaultWidth: number;
  defaultHeight: number;
  minWidth?: number;
  minHeight?: number;
}

export interface WindowState {
  id: string;
  appId: AppId;
  title: string;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
  isMinimized: boolean;
  isMaximized: boolean;
  workspaceId: number;
}

export interface DesktopSettings {
  theme: DesktopTheme;
  workspaceCount: number;
  activeWorkspace: number;
  fontSize: number;
  soundEnabled: boolean;
  showDesktopIcons: boolean;
}
