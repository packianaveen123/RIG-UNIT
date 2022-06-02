import React, { Component } from "react";
import { Row, Layout, Progress, Col, Input, Switch } from "antd";
import { connect } from "react-redux";
import { ImArrowUp, ImArrowDown } from "react-icons/im";
import { fcvTransferEvent } from "../../../Services/requests";
import { testParamHash } from "../../../Services/constants";
import {
  updateAirServoInput,
  updateKeroseneInput,
} from "../../../Redux/action";
import { IoToggle } from "react-icons/io5";
import { FiToggleRight, FiToggleLeft } from "react-icons/fi";

const {
  Startdata,
  nShutdowndata,
  eShutdowndata,
  airValue_warning,
  fuelValue_warning,
} = testParamHash;
class CVStageComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      errormsg: "",
    };
  }

  //FCV value increasing and decreasing
  fineCVIncreseClick = () => {
    if (
      this.props.app.airServoInput === 0 ||
      this.props.app.airServoInput === undefined ||
      this.props.app.airServoInput < 0.01 ||
      this.props.app.airServoInput > 2
    ) {
      this.setState({
        errormsg: airValue_warning,
      });
      return;
    }
    const body = {
      state: 1,
      fcvValue: this.props.app.chartData[0].S8,
      testId: this.props.app.testIdData,
      decimalNum: this.props.app.airServoInput,
      operationType: 1,
    };
    fcvTransferEvent(body, (data) => {});
  };

  fineCVDecreseClick = () => {
    if (
      this.props.app.airServoInput === 0 ||
      this.props.app.airServoInput === undefined ||
      this.props.app.airServoInput < 0.01 ||
      this.props.app.airServoInput > 2
    ) {
      this.setState({
        errormsg: airValue_warning,
      });
      return;
    }
    const body = {
      state: 1,
      fcvValue: this.props.app.chartData[0].S8,
      testId: this.props.app.testIdData,
      decimalNum: this.props.app.airServoInput,
      operationType: 2,
    };
    fcvTransferEvent(body, (data) => {});
  };

  fuelCVIncreseClick = () => {
    if (
      this.props.app.keroseneInput === 0 ||
      this.props.app.keroseneInput === undefined ||
      this.props.app.keroseneInput < 0.01 ||
      this.props.app.keroseneInput > 2
    ) {
      this.setState({
        errormsg: fuelValue_warning,
      });
      return;
    }

    const body = {
      state: 2,
      fcvValue: this.props.app.chartData[0].S9,
      testId: this.props.app.testIdData,
      decimalNum: this.props.app.keroseneInput,
      operationType: 1,
    };
    fcvTransferEvent(body, (data) => {});
  };

  fuelCVDecreseClick = () => {
    if (
      this.props.app.keroseneInput === 0 ||
      this.props.app.keroseneInput === undefined ||
      this.props.app.keroseneInput < 0.01 ||
      this.props.app.keroseneInput > 2
    ) {
      this.setState({
        errormsg: fuelValue_warning,
      });
      return;
    }

    const body = {
      state: 2,
      fcvValue: this.props.app.chartData[0].S9,
      testId: this.props.app.testIdData,
      decimalNum: this.props.app.keroseneInput,
      operationType: 2,
    };
    fcvTransferEvent(body, (data) => {});
  };
  onChangeAirservoValve = (event) => {
    this.props.updateAirServoInput(event.target.value);
  };
  onChangeKeroseneValve = (event) => {
    this.props.updateKeroseneInput(event.target.value);
  };

  render() {
    let fine_FCV = this.props.app.chartData[0].S8;
    let fuel_FCV = this.props.app.chartData[0].S9;
    let turboStart = this.props.app.turboStart;
    let switchData = this.props.app.chartData[0].P46;

    const StartdataArray = turboStart.filter((it) =>
      Startdata.find((val) => val === it.name)
    );
    const nShutdowndataArray = turboStart.filter((it) =>
      nShutdowndata.find((val) => val === it.name)
    );

    const eShutdowndataArray = turboStart.filter((it) =>
      eShutdowndata.find((val) => val === it.name)
    );

    return (
      <div style={{ marginTop: "15px" }}>
        <Layout className="cv-component">
          <Row>
            {/* 1rd card */}
            <Row className="progress_box">
              <div>
                <Row gutter={[34, 34]}>
                  <Col span={12}>
                    <div style={{ marginTop: "3%" }}>
                      <Progress
                        strokeWidth={10}
                        strokeColor="#03fc28"
                        type="circle"
                        width={65}
                        style={{ marginLeft: "2px" }}
                        percent={fine_FCV}
                      />
                    </div>
                  </Col>

                  <Col span={6} style={{ marginTop: "10%" }}>
                    {StartdataArray.find(
                      (it) => it.name === "Start Initiated"
                    ) &&
                    nShutdowndataArray.length === 0 &&
                    eShutdowndataArray.length === 0 ? (
                      <div>
                        {fine_FCV >= 100 ? (
                          <ImArrowUp className="arrow-btn-disable" size={30} />
                        ) : (
                          <ImArrowUp
                            size={30}
                            className="arrow-btn"
                            onClick={() => this.fineCVIncreseClick()}
                          />
                        )}
                      </div>
                    ) : (
                      <div className="arrow-btn-disable">
                        <ImArrowUp size={30} />
                      </div>
                    )}
                  </Col>

                  <Col span={6} style={{ marginTop: "10%" }}>
                    {StartdataArray.find(
                      (it) => it.name === "Start Initiated"
                    ) &&
                    nShutdowndataArray.length === 0 &&
                    eShutdowndataArray.length === 0 ? (
                      <div>
                        {fine_FCV <= 0 ? (
                          <ImArrowDown
                            className="arrow-btn-disable"
                            size={30}
                          />
                        ) : (
                          <ImArrowDown
                            size={30}
                            className="arrow-btn"
                            onClick={() => this.fineCVDecreseClick()}
                          />
                        )}
                      </div>
                    ) : (
                      <div className="arrow-btn-disable">
                        <ImArrowDown size={30} />
                      </div>
                    )}
                  </Col>
                </Row>
                <Row style={{ marginLeft: "60px", marginTop: "5%" }}>
                  <Input
                    value={this.props.app.airServoInput}
                    onChange={this.onChangeAirservoValve}
                    style={{ width: "80px" }}
                  ></Input>
                </Row>
                <Row>
                  <div
                    className="progress_title"
                    style={{ marginLeft: "40px", marginTop: "2%" }}
                  >
                    <strong>Air Servo Valve</strong>
                  </div>
                </Row>
              </div>
            </Row>

            {/* 2rd card */}
            <Row className="progress_box" style={{ marginLeft: "10px" }}>
              <div>
                <Row gutter={[34, 34]}>
                  <Col span={12}>
                    <div style={{ marginTop: "3%" }}>
                      <Progress
                        strokeWidth={10}
                        strokeColor="#03fc28"
                        type="circle"
                        width={65}
                        style={{ marginLeft: "2px" }}
                        percent={fuel_FCV}
                      />
                    </div>
                  </Col>
                  <Col span={6} style={{ marginTop: "10%" }}>
                    {StartdataArray.find(
                      (it) => it.name === "Start Initiated"
                    ) &&
                    nShutdowndataArray.length === 0 &&
                    eShutdowndataArray.length === 0 ? (
                      <div>
                        {fuel_FCV >= 100 ? (
                          <ImArrowUp className="arrow-btn-disable" size={30} />
                        ) : (
                          <ImArrowUp
                            size={30}
                            className="arrow-btn"
                            onClick={() => this.fuelCVIncreseClick()}
                          />
                        )}
                      </div>
                    ) : (
                      <div className="arrow-btn-disable">
                        <ImArrowUp size={30} />
                      </div>
                    )}
                  </Col>

                  <Col span={6} style={{ marginTop: "10%" }}>
                    {StartdataArray.find(
                      (it) => it.name === "Start Initiated"
                    ) &&
                    nShutdowndataArray.length === 0 &&
                    eShutdowndataArray.length === 0 ? (
                      <div>
                        {fuel_FCV <= 0 ? (
                          <ImArrowDown
                            className="arrow-btn-disable"
                            size={30}
                          />
                        ) : (
                          <ImArrowDown
                            size={30}
                            className="arrow-btn"
                            onClick={() => this.fuelCVDecreseClick()}
                          />
                        )}
                      </div>
                    ) : (
                      <div className="arrow-btn-disable">
                        <ImArrowDown size={30} />
                      </div>
                    )}
                  </Col>
                </Row>
                <Row style={{ marginLeft: "60px", marginTop: "5%" }}>
                  <Input
                    value={this.props.app.keroseneInput}
                    onChange={this.onChangeKeroseneValve}
                    style={{ width: "80px" }}
                  ></Input>
                </Row>
                <Row>
                  <div
                    className="progress_title"
                    style={{ marginLeft: "45px", marginTop: "2%" }}
                  >
                    <strong>Kerosene Valve</strong>
                  </div>
                </Row>
              </div>
            </Row>

            {/* 3rd card */}
            <Row className="progress_box" style={{ marginLeft: "10px" }}>
              <Row gutter={[8]}>
                <Col>
                  <div className="statistic-block block">
                    <Progress
                      strokeWidth={10}
                      strokeColor="#03fc28"
                      type="circle"
                      width={60}
                      style={{ marginLeft: "28px" }}
                      percent={this.props.app.chartData[0].P28}
                    />
                    <div className="title">
                      <div style={{ fontSize: "10px", marginTop: "30px" }}>
                        <strong>bypass valve2</strong>
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>
            </Row>

            {/* 4rd card */}
            <Row className="progress_box" style={{ marginLeft: "10px" }}>
              <Row gutter={[8]}>
                <Col>
                  <div className="statistic-block block">
                    <Progress
                      strokeWidth={10}
                      strokeColor="#03fc28"
                      type="circle"
                      width={60}
                      style={{ marginLeft: "28px" }}
                      percent={this.props.app.chartData[0].P45}
                    />
                    <div className="title">
                      <div style={{ fontSize: "10px", marginTop: "30px" }}>
                        <strong>4" Bypass fcv</strong>
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>
            </Row>

            {/* 5th card */}
            <Row className="progress_box" style={{ marginLeft: "10px" }}>
              <Row gutter={[8]}>
                <Col>
                  <div className="statistic-block block">
                    <div style={{ marginLeft: "20px", marginRight: "20px" }}>
                      {" "}
                      {/* <Switch defaultChecked={switchData} /> */}
                      {switchData == 1 ? (
                        <FiToggleRight size="55" style={{ color: "lime" }} />
                      ) : (
                        <FiToggleLeft size="55" style={{ color: "red" }} />
                      )}
                    </div>

                    <div className="title">
                      <div style={{ fontSize: "10px", marginTop: "30px" }}>
                        <strong>bypass sv</strong>
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>
            </Row>
          </Row>
        </Layout>
      </div>
    );
  }
}
const mapStateToProps = (state) => ({
  app: state.app,
});

const mapDispatchToProps = { updateAirServoInput, updateKeroseneInput };

const CVStage = connect(mapStateToProps, mapDispatchToProps)(CVStageComponent);
export default CVStage;