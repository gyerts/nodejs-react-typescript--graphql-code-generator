const local = {
   interfacesPath: '',
   clientOutDir: '',
   serverOutDir: '',
};

export const options = {
   interfacesPath: {
      set: (interfacesPath: string) => {
         local.interfacesPath = interfacesPath;
      },
      get: () => local.interfacesPath,
   },
   clientOutDir: {
      set: (clientOutDir: string) => {
         local.clientOutDir = clientOutDir;
      },
      get: () => local.clientOutDir,
   },
   serverOutDir: {
      set: (serverOutDir: string) => {
         local.serverOutDir = serverOutDir;
      },
      get: () => local.serverOutDir,
   },
};
