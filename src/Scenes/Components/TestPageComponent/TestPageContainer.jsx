import React, { Component } from "react";
import {
  Card,
  Layout,
  Row,
  Col,
  Divider,
  Input,
  Select,
  Alert,
  Button,
  Popover,
  Space,
  Typography,
  message,
  Menu,
  Form,
} from "antd";

import {
  DownloadOutlined,
  PlaySquareOutlined,
  SyncOutlined,
  PoweroffOutlined,
  QuestionOutlined,
  RedoOutlined,
  MinusOutlined,
  CheckOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import {
  initiateShutdown,
  initiateCommunicationFailed,
  initiateCommunication,
  initiateTargetState,
  initiateShowTarget,
  initiateTurboStart,
  initiateStageThree,
  getTargetRPM,
  getTargetTemp,
  getResetTemp,
  getResetRPM,
  stopDbInsert,
  updateNotifyAction,
  gettingTestIdData,
  updateResetButtonClick,
} from "../../../Redux/action";
import {
  updateChartData,
  navigateMainPage,
  updateTestIdValue,
  updateTestIdCount,
  updateDropDown,
  startDisableEvent,
} from "../../../Redux/action";
import ListItems from "../subComponents/ListItems";
import {
  shutdownClickEvent,
  getHandleChangetestID,
  requestStatusData,
} from "../../../Services/requests";
import { connect } from "react-redux";
import axios from "axios";
import {
  testParamHash,
  turboConfigValue,
  helpPopup,
} from "../../../Services/constants";
var { Option } = Select;
const { Text } = Typography;
const { SubMenu } = Menu;
let count = 1;

const {
  duplicate_msg,
  warning_Id,
  warning_mode,
  warning_name,
  alert_targetval,

  /*MOD bugid-(GOARIG_7015) */
  Initializedata,
  Startdata,
  nShutdowndata,
  eShutdowndata,
  Resetdata,
} = testParamHash;

const { installed_turbine } = turboConfigValue;
const {
  value,
  Flame,
  CompressorAirControlValve,
  AirServoCntrlValve1,
  ByPassSolenoidValve1,
  KerosenePump,
  LubeOilPump,
  CoolingPump,
  KeroseneFuelFlowValve,
  AirInjectorSolenoidValve,
  PilotFlameAirSolenoidValve,
  Acetelenegas,
  //  {/* ADD -  GOARIG_7010 */}
  ErrorCode,
} = helpPopup;

class TestPageContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      turboIdDefaultValue: "Select Turbo ID",
      // turboIdValue: "Select Turbo ID",
      truboIDnum: true,
      testingData: null,
      value: null,
      testerItems: [],
      witnessItems: [],
      turboIdval: "",
      turboIdTestCount: [],
      currentTesterItem: null,
      currentWitnessItem: null,
      isDuplicateTester: false,
      isDuplicateWitness: false,
      visible: false,
      valvestatustime: "",
      valvestatus: "",
      Flame: "OFF",
      CompressorAirControlValve: "OFF",
      AirServoCntrlValve1: "OFF",
      ByPassSolenoidValve1: "OFF",
      KerosenePump: "OFF",
      LubeOilPump: "OFF",
      CoolingPump: "OFF",
      KeroseneFuelFlowValve: "OFF",
      AirInjectorSolenoidValve: "OFF",
      PilotFlameAirSolenoidValve: "OFF",
      Acetelenegas: "OFF",

      // ADD -  GOARIG_7010
      ErrorCode: "0",
      currentDateTime: "",
      turbostartname: [],
      overalldata: [],
      errormsg: "",

      /*DEL bugid-(GOARIG_7019) */
      // shutdownEnable: false,
      tubineStatus: false,
      failedField: [],
    };
    this.interval = null;
    this.startClick = this.startClick.bind(this);
    this.addTesterItem = this.addTesterItem.bind(this);
    this.addWitnessItem = this.addWitnessItem.bind(this);
    this.handleTesterInput = this.handleTesterInput.bind(this);
    this.handleWitnessInput = this.handleWitnessInput.bind(this);
    this.deleteTesterItem = this.deleteTesterItem.bind(this);
    this.deleteWitnessItem = this.deleteWitnessItem.bind(this);
  }

  componentDidMount() {
    //getting installed turbine name form db
    requestStatusData((data) => {
      if (typeof data !== "string" && data.length > installed_turbine) {
        this.props.navigateMainPage("turboConfig");
        this.props.updateNotifyAction("true");
      } else if (typeof data !== "string" && data.length <= installed_turbine) {
        this.props.updateNotifyAction("false");
      }
    });
  }

  //helpPopover action
  handleVisibleChange = (visible) => {
    if (this.props.app.showTarget === true) {
      this.setState({ visible });
    }
  };

  //add Tester details
  addTesterItem(e) {
    e.preventDefault();
    const { currentTesterItem, testerItems } = this.state;
    const newItem = currentTesterItem;
    const isDuplicateTester = testerItems.includes(newItem);
    if (isDuplicateTester) {
      this.setState({
        isDuplicateTester: isDuplicateTester,
      });
      message.warning(duplicate_msg);
    }
    if (newItem !== null && !isDuplicateTester) {
      this.setState({
        testerItems: [...testerItems, newItem],
        currentTesterItem: null,
      });
    }
  }

  //add Witness details
  addWitnessItem(e) {
    e.preventDefault();
    const { currentWitnessItem, witnessItems } = this.state;
    const newItem = currentWitnessItem;
    const isDuplicateWitness = witnessItems.includes(newItem);
    if (isDuplicateWitness) {
      this.setState({
        isDuplicateWitness: isDuplicateWitness,
      });
      message.warning(duplicate_msg);
    }
    if (newItem !== null && !isDuplicateWitness) {
      this.setState({
        witnessItems: [...witnessItems, newItem],
        currentWitnessItem: null,
      });
    }
  }

  //Tester onchange
  handleTesterInput(e) {
    this.setState({
      currentTesterItem: e.target.value,
    });
  }

  //witness onchange
  handleWitnessInput(e) {
    this.setState({
      currentWitnessItem: e.target.value,
    });
  }

  //deletion for tester
  deleteTesterItem(text) {
    const filteredItems = this.state.testerItems.filter(
      (item) => item !== text
    );
    this.setState({
      testerItems: filteredItems,
    });
  }

  //deletion for witness
  deleteWitnessItem(text) {
    const filteredItems = this.state.witnessItems.filter(
      (item) => item !== text
    );
    this.setState({
      witnessItems: filteredItems,
    });
  }

  //select the TestId
  handleChangetestID = (value) => {
    this.setState({
      truboIDnum: true,
    });
    this.props.updateTestIdValue(value);
    const body = {
      turboIdValue: value,
    };
    let that = this;

    //getting data from axios in request page
    getHandleChangetestID(body, (data) => {
      if (data === "" || data.length === 0) {
        that.setState({
          turboIdTestCount: 1,
        });
      } else {
        that.setState({
          turboIdTestCount: data,
        });
      }
      //updating to the store called turboIdTestCount
      this.props.updateTestIdCount(this.state.turboIdTestCount);
    });
  };

  //onclick for shutdown
  shutdownClick = () => {
    /*DEL bugid-(GOARIG_7019) */
    // this.setState({
    //   shutdownEnable: false,
    // });

    shutdownClickEvent((data) => {
      //updating to the store called shutdownInitiated
      this.props.initiateShutdown(data);
    });
  };

  // {/*DEL bugid-(GOARIG_7005) */}
  // //graph data
  // requestChartData() {
  //   gettingChartData((data) => {
  //     //this function from request page
  //     let chartData = data;
  //     //updating to the store called chartdata
  //     this.props.updateChartData(chartData);
  //   });
  // }

  // {/*DEL bugid-(GOARIG_7022) */}
  // //this event trigger while clicking the initialize
  // sensorData() {
  //   //fetching sensor data from DB
  //   getSensorData((data) => {
  //     let val = data;
  //     if (this.props.app.communication === true && val.length >= 1) {
  //       this.props.initiateTurboStart(val);
  //     }
  //     // else {
  //     //   this.props.initiateTurboStart([]);
  //     // }
  //   });
  // }

  //getting communication value in request page
  communicationstatus() {
    /* ADD bugid-(GOARIG_7021)   */
    //type 0 -> initialize clicked
    this.props.updateResetButtonClick(0);
    axios
      .post("http://localhost:5000/initialize.php", {
        testId: this.props.app.testIdData,
        nozzleArea: this.props.app.statusData[0].nozzlearea,
      })
      .then((res) => {
        let CommunicationData = res.data;
        if (CommunicationData.status === "1") {
          this.props.initiateCommunication();
        } else if (CommunicationData.status === "") {
          this.props.initiateCommunicationFailed();
          this.setState({ failedField: true });
        }
        this.initializeTestClick();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  //initialize event onclick
  initializeClick = () => {
    this.props.updateDropDown(null);
    if (
      this.props.app.testIdValue === "" ||
      this.props.app.testIdValue === undefined ||
      this.props.app.testIdValue.length === 0
    ) {
      this.setState({
        errormsg: warning_Id,
      });
      return;
    }

    if (this.state.testerItems.length === 0) {
      this.setState({
        errormsg: warning_name,
      });
      return;
    }

    if (
      this.props.app.testIdValue !== undefined &&
      this.props.app.testIdValue !== "" &&
      this.state.testerItems.length !== 0 &&
      this.props.app.communication === false &&
      this.props.app.testIdValue.length !== 0
    ) {
      axios
        .post("http://localhost:5000/gettestid.php", {
          turboIdVal: this.props.app.testIdValue,
          testerItems: this.state.testerItems,
          witnessItems: this.state.witnessItems,
        })
        .then((res) => {
          /* ADD bugid-(GOARIG_7021)   */
          let data = res.data;

          //updated testId in reduxc store - testIdData
          this.props.gettingTestIdData(data);
          this.communicationstatus();
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  //start click
  initializeTestClick = () => {
    var today = new Date(),
      time =
        today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    this.setState({
      currentDateTime: time,
    });
    // axios
    //   .get("http://localhost:8000/testdata.php")
    //   .then(function (response) {})
    //   .catch((err) => {
    //     console.log(err);
    //   });
  };

  //help event onClick
  onClickhelp = () => {
    var self = this;
    axios
      .get("http://localhost:5000/valvestatus.php")
      .then(function (response) {
        let valveData = response.data.valvestatus.split(",");
        self.setState({
          valvestatustime: response.data.testcommandsTime,
        });
        self.setState({
          valvestatus: response.data.valvestatus,
        });
        // {/* ADD -  GOARIG_7010 */}
        //the order should be same ,because the order handled in php
        self.setState({
          ErrorCode: valveData[11],
        });
        if (valveData[0] === "1") {
          self.setState({
            Flame: "ON",
          });
        }
        if (valveData[1] === "1") {
          self.setState({
            CompressorAirControlValve: "ON",
          });
        }
        if (valveData[2] === "1") {
          self.setState({
            AirServoCntrlValve1: "ON",
          });
        }
        if (valveData[3] === "1") {
          self.setState({
            ByPassSolenoidValve1: "ON",
          });
        }
        if (valveData[4] === "1") {
          self.setState({
            KerosenePump: "ON",
          });
        }
        if (valveData[5] === "1") {
          self.setState({
            LubeOilPump: "ON",
          });
        }
        if (valveData[6] === "1") {
          //{/*ADD - GOARIG_7004 */}
          self.setState({
            CoolingPump: "ON",
          });
        }
        if (valveData[7] === "1") {
          self.setState({
            //{/*ADD - GOARIG_7004 */}
            KeroseneFuelFlowValve: "ON",
          });
        }
        if (valveData[8] === "1") {
          self.setState({
            AirInjectorSolenoidValve: "ON",
          });
        }
        if (valveData[9] === "1") {
          self.setState({
            PilotFlameAirSolenoidValve: "ON",
          });
        }
        if (valveData[10] === "1") {
          self.setState({
            Acetelenegas: "ON",
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  //input onChange values
  onChangeResettempvalue = (event) => {
    const re = /^[0-9\b]+$/;
    if (event.target.value === "" || re.test(event.target.value)) {
      this.props.getResetTemp(event.target.value);
    }
  };

  //resetRPM onclick
  onChangeResetRPMvalue = (event) => {
    const re = /^[0-9\b]+$/;
    if (event.target.value === "" || re.test(event.target.value)) {
      this.props.getResetRPM(event.target.value);
    }
  };

  //targetTemp onclick
  onChangetempvalue = (event) => {
    const re = /^[0-9\b]+$/;
    if (event.target.value === "" || re.test(event.target.value)) {
      this.props.getTargetTemp(event.target.value);
    }
  };

  //targetRPM onclick
  onChangeRPMvalue = (event) => {
    const re = /^[0-9\b]+$/;
    if (event.target.value === "" || re.test(event.target.value)) {
      this.props.getTargetRPM(event.target.value);
    }
  };

  //reset event onClick
  resetOnClick = () => {
    axios
      .post("http://localhost:5000/reset_targetVal.php", {
        ResetRPM: this.props.app.resetRPM,
        ResetTemp: this.props.app.resetTemp,
        testId: this.props.app.testIdData,
      })
      .then((res) => {})
      .catch((err) => {
        console.log(err);
      });
    // if (
    //   parseInt(this.props.app.resetTemp) >
    //     parseInt(this.props.app.paramConfig[16].upperlimit) ||
    //   parseInt(this.props.app.resetRPM) >
    //     parseInt(this.props.app.paramConfig[15].upperlimit)
    // ) {
    //   message.error("Temprature or RPM exceeded the limit");
    // } else {
    // }
  };

  //start event onClick
  startClick = () => {
    /// if (this.props.app.communication === true) {
    /*ADD bugid-(GOARIG_7025) */
    // if (
    //   parseInt(this.props.app.targetTemp) >
    //     parseInt(this.props.app.paramConfig[16].upperlimit) ||
    //   parseInt(this.props.app.targetRPM) >
    //     parseInt(this.props.app.paramConfig[15].upperlimit)
    // ) {
    //   message.error("Temprature or RPM exceeded the limit");
    // } else {
    //  if (this.props.app.targetRPM !== "" && this.props.app.targetTemp !== "") {
    this.props.initiateShowTarget();
    /*DEL bugid-(GOARIG_7019) */
    // this.setState({
    //   shutdownEnable: true,
    // });
    /*ADD bugid-(GOARIG_7019) */
    this.props.startDisableEvent(true);

    // setInterval(() => {
    //   this.requestChartData();
    // }, this.props.app.delayValue);
    //delay for receiving sensor data from plc
    axios
      .post("http://localhost:5000/start.php", {
        //set target rpm & temp value to sent plc
        testId: this.props.app.testIdData,
        targetRPM: this.props.app.targetRPM,
        targetTemp: this.props.app.targetTemp,
        initialAirSv: this.props.app.cvStageValue.AirSVInitValve,
        initialkerosene: this.props.app.cvStageValue.KeroseneSVInitValve,
      })
      .then((res) => {})
      .catch((err) => {
        console.log(err);
      });
    // } else {
    //   this.props.initiateTargetState();
    // }
    // }
    //}
  };

  //error msg onclick
  errorDoneClick = () => {
    this.setState({
      errormsg: "",
    });
  };

  //reSet all action in the store and state
  reloadAllEvents = () => {
    axios
      .post("http://localhost:5000/reset.php", {})
      .then((res) => {})
      .catch((err) => {
        console.log(err);
      });

    /*ADD bugid-(GOARIG_7021) */
    this.props.gettingTestIdData(0);
    this.props.stopDbInsert();
    this.props.updateTestIdCount("");
    this.props.updateTestIdValue("");
    this.props.initiateTurboStart([]);
    this.props.updateResetButtonClick(1);
    this.props.getResetTemp("");
    this.props.getResetRPM("");

    /*ADD bugid-(GOARIG_7019) */
    this.props.startDisableEvent(false);

    this.setState({
      turboIdDefaultValue: "Select Turbo ID",
      turboIdValue: "Select Turbo ID",
      truboIDnum: false,
      testingData: null,
      value: null,
      testerItems: [],
      witnessItems: [],
      currentTesterItem: null,
      currentWitnessItem: null,
      isDuplicateTester: false,
      isDuplicateWitness: false,
      visible: false,
      valvestatustime: "",
      valvestatus: "",
      svcoolingair: "OFF",
      svpilotflameair: "OFF",
      svnaturalgastopilotflame: "OFF",
      svdilution: "OFF",
      fcvcomplressorair: "OFF",
      fcvmaingasfuel: "OFF",
      currentDateTime: "",
      turbostartname: [],
      overalldata: [],
      errormsg: "",
      turboIdTestCount: null,
      failedField: [],
    });
  };

  //alertOnclose
  alertOnClose = () => {
    this.props.initiateTargetState();
  };

  render() {
    const shutdownInitiated = this.props.app.shutdownInitiated;
    const communicationFailed = this.props.app.communicationFailed;
    const communication = this.props.app.communication;
    const targetState = this.props.app.targetState;
    const showTarget = this.props.app.showTarget;
    const targetTemp = this.props.app.targetTemp;
    const targetRPM = this.props.app.targetRPM;
    const resetTemp = this.props.app.resetTemp;
    const resetRPM = this.props.app.resetRPM;
    let turboStart = this.props.app.turboStart;

    /*DEL bugid-(GOARIG_7015) */
    // const { Initializedata, Startdata, Shutdowndata, Resetdata } =
    // testParamHash;

    const InitializedataArray = turboStart.filter((it) =>
      Initializedata.find((val) => val === it.name)
    );

    const StartdataArray = turboStart.filter((it) =>
      Startdata.find((val) => val === it.name)
    );

    const nShutdowndataArray = turboStart.filter((it) =>
      nShutdowndata.find((val) => val === it.name)
    );

    /*ADD bugid-(GOARIG_7015) */
    const eShutdowndataArray = turboStart.filter((it) =>
      eShutdowndata.find((val) => val === it.name)
    );

    const ResetdataArray = turboStart.filter((it) =>
      Resetdata.find((val) => val === it.name)
    );

    const InitializedCompletedStatus = InitializedataArray.filter(
      (word) => word.name === "Initialize Completed"
    );

    var testIdValue = null;
    if (
      this.props.app.statusData !== "no_data" &&
      this.props.app.statusData.length !== 0
    ) {
      var testIdValue = this.props.app.statusData.filter(
        (word) => word.status === "installed"
      );
    }

    return (
      <div style={{ paddingTop: "15px" }}>
        <Layout className="test-layout">
          <div>
            <Menu
              style={{
                width: "100%",
                backgroundColor: "transparent",
                paddingRight: "20px",
              }}
              defaultSelectedKeys={["1"]}
              defaultOpenKeys={[this.props.app.testDropdown]}
              theme="dark"
              mode="inline"
            >
              <SubMenu
                key="sub1"
                className="test-dropdown"
                title="Turbine Details"
                style={{ fontSize: "18px" }}
              >
                <Layout
                  style={{
                    backgroundColor: "transparent",
                    paddingTop: "0px",
                    paddingLeft: "20px",
                  }}
                >
                  <Row
                    gutter={[16, 8]}
                    style={{ paddingTop: "2%", paddingLeft: "20px" }}
                  >
                    <Form.Item label="Turbo ID">
                      {communication ? (
                        <Input.Group compact>
                          <Select
                            disabled
                            defaultValue={this.state.turboIdDefaultValue}
                            style={{ width: "300px" }}
                          ></Select>
                        </Input.Group>
                      ) : (
                        <Input.Group compact>
                          {testIdValue && testIdValue.length > 0 ? (
                            <Select
                              defaultValue={this.state.turboIdDefaultValue}
                              style={{ width: "300px" }}
                              onChange={this.handleChangetestID}
                              value={this.state.turboIdValue}
                            >
                              {this.props.app.statusData.map((it) => (
                                <Option key={it.turboname} value={it.turboname}>
                                  {it.turboname}
                                </Option>
                              ))}
                            </Select>
                          ) : (
                            <Space type="warning" style={{ color: "red" }}>
                              No active turbines
                            </Space>
                          )}
                        </Input.Group>
                      )}

                      {this.props.app.statusData ? (
                        <Row style={{ paddingLeft: "5rem" }}>
                          {this.state.truboIDnum ? (
                            <div
                              style={{
                                color: "white",
                                marginLeft: "15px",
                                marginTop: "10px",
                              }}
                            >
                              <span style={{ color: "lime" }}>
                                {this.props.app.testIdValue}
                              </span>

                              {this.props.app.testIdValue.length !== 0 ? (
                                <MinusOutlined style={{ color: "#42dbdc" }} />
                              ) : (
                                []
                              )}
                              <span style={{ color: "lime" }}>
                                {this.props.app.turboIdTestCount}
                              </span>
                            </div>
                          ) : (
                            []
                          )}
                        </Row>
                      ) : (
                        []
                      )}
                    </Form.Item>

                    <form
                      onSubmit={(e) => this.addTesterItem(e, "tester")}
                      style={{
                        marginLeft:
                          this.props.app.statusData.length == 0 ? "5%" : "5%",
                      }}
                    >
                      <Form.Item label="Tester">
                        {communication ? (
                          <Input
                            disabled
                            placeholder="Test Engg"
                            name="Test Engg"
                            style={{ width: "300px" }}
                          />
                        ) : (
                          <Input
                            placeholder="Test Engg"
                            name="Test Engg"
                            style={{ width: "300px" }}
                            value={this.state.currentTesterItem}
                            onChange={this.handleTesterInput}
                          />
                        )}
                        <button className="add-btn" type="submit">
                          +
                        </button>
                        <Row>
                          <ListItems
                            items={this.state.testerItems}
                            deleteItem={this.deleteTesterItem}
                          />
                        </Row>
                      </Form.Item>
                    </form>

                    <form
                      onSubmit={(e) => this.addWitnessItem(e, "witness")}
                      style={{
                        marginLeft:
                          this.props.app.statusData.length == 0 ? "20%" : "5%",
                      }}
                    >
                      <Form.Item label="Witness">
                        {communication ? (
                          <Input
                            disabled
                            placeholder="Witness"
                            name="Witness"
                            style={{ width: "300px" }}
                          />
                        ) : (
                          <Input
                            placeholder="Witness"
                            name="Witness"
                            style={{ width: "300px" }}
                            value={this.state.currentWitnessItem}
                            onChange={this.handleWitnessInput}
                          />
                        )}
                        <button className="add-btn" type="submit">
                          +
                        </button>

                        <Row>
                          <ListItems
                            items={this.state.witnessItems}
                            deleteItem={this.deleteWitnessItem}
                          />
                        </Row>
                      </Form.Item>
                    </form>
                  </Row>

                  <Row>
                    {this.state.errormsg ? (
                      <Alert
                        message={this.state.errormsg}
                        type="error"
                        action={
                          <Space>
                            <Button
                              size="small"
                              type="ghost"
                              onClick={() => this.errorDoneClick()}
                            >
                              Done
                            </Button>
                          </Space>
                        }
                      />
                    ) : (
                      ""
                    )}
                  </Row>
                </Layout>
              </SubMenu>
            </Menu>
          </div>

          <Row style={{ paddingRight: "20px" }}>
            <Divider style={{ borderColor: "#42dad6" }} />

            <Col span={6}>
              <Card
                style={{ width: 185, cursor: "pointer", borderColor: "green" }}
              >
                <div style={{ width: "300px" }}>
                  {/* MOD bugid-(GOARIG_7016)  */}
                  {communication === true || communicationFailed === true ? (
                    <DownloadOutlined className="iconbutton1-basic" />
                  ) : (
                    <DownloadOutlined
                      className="icon-button1"
                      onClick={() => this.initializeClick()}
                    />
                  )}

                  <p
                    style={{
                      color: "#42dad6",
                      fontSize: "20px",
                      paddingLeft: "20px",
                    }}
                  >
                    Initialize
                  </p>
                  {communicationFailed ? (
                    <p>
                      {this.state.failedField === true ? (
                        <Row>
                          <CloseOutlined
                            style={{ color: "red", marginTop: "1%" }}
                          />

                          <p className="commands">
                            {this.state.currentDateTime}- Communication failed
                          </p>
                        </Row>
                      ) : (
                        []
                      )}
                    </p>
                  ) : (
                    []
                  )}
                  {communication ? (
                    <p>
                      {InitializedataArray.map((item) => {
                        return (
                          <div className="commands">
                            <CheckOutlined
                              style={{ color: "green", marginTop: "1%" }}
                            />
                            {item.testcommandsTime} - {item.name}
                          </div>
                        );
                      })}
                    </p>
                  ) : (
                    []
                  )}
                </div>
              </Card>
            </Col>

            <Col span={7}>
              <Card
                style={
                  InitializedCompletedStatus.length >= 1 && communication
                    ? { width: 185, cursor: "pointer", borderColor: "green" }
                    : { width: 185, borderColor: "gray" }
                }
              >
                <div style={{ width: "300px" }}>
                  {InitializedCompletedStatus.length >= 1 &&
                  communication &&
                  this.props.app.startDisable === false ? (
                    <PlaySquareOutlined
                      className="icon-button1"
                      onClick={() => this.startClick()}
                    />
                  ) : (
                    <PlaySquareOutlined className="iconbutton1-basic" />
                  )}
                  {InitializedCompletedStatus.length >= 1 && communication ? (
                    <p
                      style={{
                        color: "#42dad6",
                        fontSize: "20px",
                        paddingLeft: "35px",
                      }}
                    >
                      {" "}
                      Start
                    </p>
                  ) : (
                    <p
                      style={{
                        color: "gray",
                        fontSize: "20px",
                        paddingLeft: "35px",
                      }}
                    >
                      {" "}
                      Start
                    </p>
                  )}

                  {/* {InitializedCompletedStatus.length >= 1 && communication ? (
                    <p>
                      <Row>
                        <Col>
                          <p>Target Temp,</p>
                        </Col>
                        <Col>
                          <p> &nbsp; RPM</p>
                        </Col>
                      </Row>
                      <Row>
                        <Input
                          placeholder=""
                          value={targetTemp}
                          onChange={this.onChangetempvalue}
                          name="Target_temp"
                          style={{ width: "75px" }}
                        />
                        <Input
                          placeholder=""
                          value={targetRPM}
                          onChange={this.onChangeRPMvalue}
                          name="Targrt_RPM"
                          style={{ width: "75px" }}
                        />
                      </Row>
                    </p>
                  ) : (
                    []
                  )} */}
                  {/* {targetState ? (
                    <Alert
                      className="alert_error"
                      message={alert_targetval}
                      closable
                      onClose={this.alertOnClose}
                      style={{ width: "60%" }}
                      type="error"
                    />
                  ) : (
                    ""
                  )} */}

                  {/* {showTarget ? (
                    <div>
                      Target Temp : {targetTemp}, &nbsp; RPM : {targetRPM}
                    </div>
                  ) : (
                    []
                  )} */}

                  {showTarget ? (
                    <p>
                      <Row>
                        {StartdataArray.map((item) => {
                          return (
                            <div className="commands">
                              <CheckOutlined
                                style={{ color: "green", marginTop: "1%" }}
                              />
                              {item.testcommandsTime} - {item.name}
                            </div>
                          );
                        })}
                      </Row>
                    </p>
                  ) : (
                    []
                  )}
                </div>
              </Card>
            </Col>

            {/* <Col span={5}>
              <Card
                style={
                  StartdataArray.find((it) => it.name === "Stage 3") &&
                  communication
                    ? { width: 185, cursor: "pointer", borderColor: "green" }
                    : { width: 185, borderColor: "gray" }
                }
              >
                <div style={{ width: "300px" }}>
                  {StartdataArray.find((it) => it.name === "Stage 3") &&
                  communication ? (
                    <SyncOutlined
                      style={{ color: "green" }}
                      className="iconbutton1-basic"
                    />
                  ) : (
                    <SyncOutlined className="iconbutton1-basic" />
                  )}

                  {StartdataArray.find((it) => it.name === "Stage 3") &&
                  communication ? (
                    <p
                      style={{
                        color: "#42dad6",
                        fontSize: "19px",
                        paddingLeft: "10px",
                      }}
                    >
                      Reset Temp
                    </p>
                  ) : (
                    <p
                      style={{
                        color: "gray",
                        fontSize: "19px",
                        paddingLeft: "10px",
                      }}
                    >
                      Reset Temp
                    </p>
                  )}

                  {communication ? (
                    <p>
                      {StartdataArray.find((it) => it.name === "Stage 3") ? (
                        <p>
                          <Row>
                            <p>Reset Temp,</p>
                            <p> &nbsp; RPM</p>
                          </Row>
                          <Row>
                            <Col>
                              {" "}
                              <Input
                                value={resetTemp}
                                onChange={this.onChangeResettempvalue}
                                name="ResetTemp"
                                style={{ width: "60px" }}
                              />
                            </Col>
                            <Col>
                              <Input
                                value={resetRPM}
                                onChange={this.onChangeResetRPMvalue}
                                name="ResetRPM"
                                style={{ width: "60px" }}
                              />
                            </Col>

                            <Col>
                              <button
                                className="add-btn"
                                onClick={() => this.resetOnClick()}
                              >
                                +
                              </button>
                            </Col>
                          </Row>
                        </p>
                      ) : (
                        []
                      )}

                      <div>
                        {ResetdataArray.map((item) => {
                          return (
                            <div>
                              <CheckOutlined
                                style={{ color: "green", marginTop: "1%" }}
                              />
                              {item.testcommandsTime} - {item.name} -{" "}
                              {item.value}
                              {(() => {
                                if (item.name === "stage 3" && count === 1) {
                                  this.props.initiateStageThree();
                                  count++;
                                }
                              })()}
                            </div>
                          );
                        })}
                      </div>
                    </p>
                  ) : (
                    []
                  )}
                </div>
              </Card>
            </Col> */}

            <Col span={6}>
              <Card
                style={
                  /*ADD bugid-(GOARIG_7018) */
                  showTarget
                    ? { width: 185, borderColor: "red", cursor: "pointer" }
                    : { width: 185, borderColor: "gray" }
                }
              >
                {" "}
                <div style={{ width: "300px" }}>
                  <div>
                    {/*ADD bugid-(GOARIG_7018) */}
                    {showTarget ? (
                      <PoweroffOutlined
                        className="icon-button3"
                        onClick={() => this.shutdownClick()}
                      />
                    ) : (
                      <PoweroffOutlined className="iconbutton3-basic" />
                    )}
                  </div>
                  {showTarget ? (
                    <p
                      style={{
                        color: "#42dad6",
                        fontSize: "20px",
                        paddingLeft: "15px",
                      }}
                    >
                      Shutdown
                    </p>
                  ) : (
                    <p
                      style={{
                        color: "gray",
                        fontSize: "20px",
                        paddingLeft: "15px",
                      }}
                    >
                      Shutdown
                    </p>
                  )}
                </div>
              </Card>

              {shutdownInitiated ? (
                <p style={{ height: "15px", color: "white", marginTop: "7px" }}>
                  <Row>
                    {nShutdowndataArray.map((item) => {
                      return (
                        <div className="commands">
                          <CheckOutlined
                            style={{ color: "green", marginTop: "3%" }}
                          />
                          {item.testcommandsTime} - {item.name}
                        </div>
                      );
                    })}
                  </Row>
                </p>
              ) : (
                []
              )}
              {/* ADD bugid-(GOARIG_7015)  */}
              {/* E-shutdown */}
              {showTarget ? (
                <p style={{ height: "15px", color: "white", marginTop: "7px" }}>
                  <Row>
                    {eShutdowndataArray.map((item) => {
                      return (
                        <div className="commands">
                          <CheckOutlined
                            style={{ color: "green", marginTop: "3%" }}
                          />
                          {item.testcommandsTime} - {item.name}
                        </div>
                      );
                    })}
                  </Row>
                </p>
              ) : (
                []
              )}
            </Col>

            <Col span={4} style={{ height: "30" }}>
              <Card
                style={
                  //  ADD bugid-(GOARIG_7020)
                  nShutdowndataArray.length >= 1 ||
                  eShutdowndataArray.length >= 1 ||
                  showTarget === false
                    ? { width: 100, cursor: "pointer", borderColor: "green" }
                    : { width: 100, borderColor: "gray" }
                }
              >
                <div>
                  {/* ADD bugid-(GOARIG_7020) */}
                  {nShutdowndataArray.length >= 1 ||
                  eShutdowndataArray.length >= 1 ||
                  showTarget === false ? (
                    <RedoOutlined
                      className="icon-button2"
                      onClick={() => this.reloadAllEvents()}
                    />
                  ) : (
                    <RedoOutlined className="iconbutton2-basic" />
                  )}
                </div>

                {/* ADD bugid-(GOARIG_7020) */}

                {nShutdowndataArray.length >= 1 ||
                eShutdowndataArray.length >= 1 ||
                showTarget === false ||
                communicationFailed === true ? (
                  <p style={{ color: "#42dad6", fontSize: "20px" }}>Reset</p>
                ) : (
                  <p style={{ color: "gray", fontSize: "20px" }}>Reset</p>
                )}
              </Card>
            </Col>

            {/* <Col span={2}>
              <Popover
                title={
                  <div>
                    <p style={{ fontWeight: "bold" }}>
                      {value} {this.state.valvestatustime}
                    </p>
                  </div>
                }
                content={
                  <div>
                    <p>
                      {Flame} {this.state.Flame}{" "}
                    </p>
                    <p>
                      {CompressorAirControlValve}{" "}
                      {this.state.CompressorAirControlValve}
                    </p>
                    <p>
                      {AirServoCntrlValve1} {this.state.AirServoCntrlValve1}
                    </p>
                    <p>
                      {ByPassSolenoidValve1} {this.state.ByPassSolenoidValve1}
                    </p>
                    <p>
                      {KerosenePump} {this.state.KerosenePump}
                    </p>
                    <p>
                      {LubeOilPump} {this.state.LubeOilPump}
                    </p>
                    <p>
                      {CoolingPump} {this.state.CoolingPump}
                    </p>
                    <p>
                      {KeroseneFuelFlowValve} {this.state.KeroseneFuelFlowValve}
                    </p>
                    <p>
                      {AirInjectorSolenoidValve}{" "}
                      {this.state.AirInjectorSolenoidValve}
                    </p>
                    <p>
                      {PilotFlameAirSolenoidValve}{" "}
                      {this.state.PilotFlameAirSolenoidValve}
                    </p>
                    <p>
                      {Acetelenegas} {this.state.Acetelenegas}
                    </p>
                    {/* ADD -  GOARIG_7010 */}
            {/* <p>
                      {ErrorCode} {this.state.ErrorCode}
                    </p>
                  </div>
                }
                trigger="click"
                placement="bottomRight"
                visible={this.state.visible}
                onVisibleChange={this.handleVisibleChange}
              >
                <Card
                  style={
                    showTarget === true
                      ? { width: 100, cursor: "pointer", borderColor: "green" }
                      : { width: 100, borderColor: "gray" }
                  }
                >
                  <div>
                    {showTarget === true ? (
                      <QuestionOutlined
                        className="icon-button4"
                        onClick={this.onClickhelp}
                      />
                    ) : (
                      <QuestionOutlined className="iconbutton4-basic" />
                    )}
                  </div>
                  {showTarget === true ? (
                    <p style={{ color: "#42dad6", fontSize: "20px" }}>Help</p>
                  ) : (
                    <p style={{ color: "gray", fontSize: "20px" }}>Help</p>
                  )}
                </Card>
              </Popover>
            </Col> */}
          </Row>
        </Layout>
      </div>
    );
  }
}
const mapStateToProps = (state) => ({
  app: state.app,
});

const mapDispatchToProps = {
  navigateMainPage,
  initiateShutdown,
  initiateCommunicationFailed,
  initiateCommunication,
  initiateTargetState,
  initiateShowTarget,
  initiateTurboStart,
  initiateStageThree,
  getTargetRPM,
  getTargetTemp,
  getResetTemp,
  getResetRPM,
  updateChartData,
  stopDbInsert,
  updateTestIdValue,
  updateTestIdCount,
  updateDropDown,
  updateNotifyAction,
  startDisableEvent,
  gettingTestIdData,
  updateResetButtonClick,
};

const TestContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(TestPageContainer);
export default TestContainer;
