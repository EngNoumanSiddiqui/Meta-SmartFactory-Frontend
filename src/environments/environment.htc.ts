// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `angular-cli.json`.

// if you do `ng build --configuration pusnik` then `environment.pusnik.ts` will be used instead.
export const environment = {
  production: true,
  // filter row size will be used to show default how much row should bee seen on list screens
  // filter row size must be one of [10, 20, 30, 50, 100, 1000]  values,
  filterRowSize: '20',
  DELAY: 2500,
  NORMALDELAY: 1000,
  redirectUri: 'https://metasmartfactory.com',
  host: 'http://163.172.130.76:6199/',
  login: 'http://163.172.130.76:6199/',
  websocketHost: 'http://163.172.130.76:6199/websocket/machine/',

};
