export * from './types';
import rawConfig from './project.json';
import { ProjectConfig } from './types';

export const projectConfig: ProjectConfig = rawConfig as ProjectConfig;