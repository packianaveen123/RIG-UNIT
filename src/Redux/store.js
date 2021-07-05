import { dashboardData, titleElements } from '../Services/constants'
const InitialState = {
  mainPage: 'testPage',
  appState: "login",
  userName: '',
  userParams: null,
  leftBarView: false,
  collapsed: true,
  chartData: [],
  testConfig: [],
  testConfigPage: [],
  turboConfig: [],
  paramConfig: [],
  transferElement: [],
  testingPage: [],
  dashboardData: dashboardData,
  titleElements: titleElements,
  statusData: '',
  testDetails: false,
  testerValue: false,
  testValue: '',
  reset: false,

  IsLogin: false,
  IsUserName: [],

  stopDbInsert: false,
  tableEdit: [],

  showReset: false,
  shutdownInitiated: false,
  communicationFailed: false,
  communication: false,
  targetState: false,
  showTarget: false,
  turboStart: [],
  gasOpend: false,
  stageOne: false,
  fuelOpened: false,
  stageTwo: false,
  gasClosed: false,
  stageThree: false,
  currentDateTime: '',
  targetRPM: '',
  targetTemp: '',
  resetTemp: '',
  resetRPM: '',
}
export default InitialState