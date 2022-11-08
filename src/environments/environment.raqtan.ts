// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `angular-cli.json`.

// if you do `ng build --configuration radokoncer` then `environment.radokoncer.ts` will be used instead.
export const environment = {
  production: true,
  // filter row size will be used to show default how much row should bee seen on list screens
  // filter row size must be one of [10, 20, 30, 50, 100, 1000]  values,
  filterRowSize: '20',
  DELAY: 2500,
  NORMALDELAY: 1000,

  // radecontar  musteri internet
  // host: 'http://94.100.97.245:6199/',
  //  login: 'http://94.100.97.245:6199/',
  //  websocketHost: 'http://94.100.97.245:9165/websocket/machine/',

  // radecontar  musteri local
   host: 'http://172.19.1.1:6199/',
   login: 'http://172.19.1.1:6199/',
   websocketHost: 'http://172.19.1.1:6198/websocket/machine/',
   redirectUri: 'https://metasmartfactory.com',
};
