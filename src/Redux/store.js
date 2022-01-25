import { dashboardDataVal, targetKeysVal, titleElements } from '../Services/constants'

const InitialState = {
  mainPage: 'testPage',
  appState: "login",
  userName: '',
  userParams: '',
  leftBarView: false,
  collapsed: true,
  titleElements: titleElements,
  turboMode: '1',

  // -- config page -- //
  testConfigPage: [],
  turboConfig: [],
  paramConfig: [],
  dashboardData: dashboardDataVal,
  targetKeys: targetKeysVal,
  tableViewData: [],
  notifyStatus: 'false',

  // -- test details -- //
  testIdValue: '',
  turboIdTestCount: '',
  testDropdown: 'sub1',

  // -- test page -- //
  statusData: '',
  reset: false,
  chartData: [0, 0, 0, 0, 0, 0, 0, 0, 0],
  /* ADD bugid-(GOARIG_7014)   */
  chartData2: [0, 0, 0, 0],
  shutdownInitiated: false,
  communicationFailed: false,
  communication: false,
  targetState: false,
  showReset: false,
  showTarget: false,
  turboStart: [],

 


  stageThree: false,

  targetRPM: '',
  targetTemp: '',
  resetTemp: '',
  resetRPM: '',
  
  /*ADD bugid-(GOARIG_7019) */
  startDisable: false,

  /* ADD bugid-(GOARIG_7021) */
  testIdData: 0,
  
  //grapgView
  delayValue: 1000,
  cvStageValue:[],
}
export default InitialState