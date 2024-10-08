import { defineStore } from 'pinia';
import { store } from '@/store';

import { storage } from '@/utils/Storage';

export interface IUserState {
  token: string;
  username: string;
  welcome: string;
  avatar: string;
  permissions: any[];
  info: any;
}

export interface ISchemaState {
  currentSchema: Schema | null;
  schemas: Schema[];
}

export const useSchemaStore = defineStore({
  id: 'app-schema',
  state: (): ISchemaState => ({
    currentSchema: null,
    schemas: [],
  }),
  getters: {
    getCurrentSchema(): Schema | null {
      return this.currentSchema;
    },
    getSchemas(): Schema[] {
      return this.schemas;
    },
  },
  actions: {
    setCurrentSchema(schema: Schema) {
      this.currentSchema = schema;
    },
    setSchemas(schemas: Schema[]) {
      this.schemas = schemas;
    },

    async fetchSchemas() {
      const { data } = await storage.get('schemas');
      this.setSchemas(data);
    },
  },
});

// Need to be used outside the setup
export function useSchemaStoreWidthOut() {
  return useSchemaStore(store);
}
