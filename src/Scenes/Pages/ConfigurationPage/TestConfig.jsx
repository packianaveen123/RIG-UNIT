import React, { Component } from 'react';
import { connect } from 'react-redux';
import { updateTestConfig, updateTitleElements } from '../../../Redux/action';
import { Col, Row, Layout, Input, Button, InputNumber, Form } from 'antd';
import TableElement from '../../Components/subComponents/TableElement';
import axios from 'axios';

class TestConfig extends Component {
  constructor(props) {
    super(props);
    this.state = {
      testData: ""
    }
  }
  componentDidMount() {
    this.props.updateTitleElements({
      title: 'Test Config',
      type: 'Config',
    })
  }

  render() {
    const testdata = this.props.app;

    console.log(testdata.testConfig)
    console.log(this.props.app.testConfig[0].testparamname)
    console.log(this.props.app.editRowIndex)
    console.log()

    return (
      <div style={{ paddingTop: "1px" }}>
        <Layout class="layout-container">
          <h2 class="h2" >Test Configuration</h2>
          <Form onFinish={this.onFinish}>
            <Row style={{ paddingTop: "20px" }} >
              <Col sm={2}>
                <label htmlFor="name" class="label">Name<i style={{ color: 'red', fontSize: '15px' }}> *</i></label>
                <span> &nbsp; &nbsp; &nbsp;</span>
              </Col>
              <Col sm={10}>
                <Form.Item>
                  <Input style={{ Color: "#666873" }} placeholder="Name" />
                </Form.Item>
              </Col>

              <Col sm={2}>
                <label class="label" >Value<i style={{ color: "red", fontSize: '15px' }}> *</i></label>
              </Col>

              <Col sm={10}>
                <Form.Item>
                  <InputNumber
                    min={-100} max={100}
                    onChange={onChange}
                    placeholder="Value"
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row style={{ paddingTop: '25px', paddingLeft: "30%", paddingBottom: '30px' }}>
              <Col xs={4}>
                <Form.Item>
                  <Button htmlType="submit"> Save</Button>
                </Form.Item>
              </Col>
              <Col xs={4}>
                <Form.Item>
                  <Button > Clear</Button>
                </Form.Item>
              </Col>
              <Col xs={4}>
                <Form.Item>
                  <Button > Reset</Button>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Layout>

        <div style={{ paddingTop: "35px" }}>
          <Layout class="bottom-container">
            <Row>
              <Col span={8}>
                <h2 class="h2">Test Configuration</h2>
              </Col>
            </Row>
            {
              testdata.testConfig ?
                <TableElement
                  data={testdata.testConfig ? testdata.testConfig : []}
                  editable={true}
                  editableColumn={["testparamvalue"]}
                  childrenColumnName={"Test Config"}
                /> : []
            }
          </Layout>
        </div>
      </div>
    )
  }
}
const onChange = (value) => (
  console.log('changed', value)
)

const mapStateToProps = state => ({
  app: state.app
})

const mapDispatchToProps = {
  updateTestConfig,
  updateTitleElements
}

const testContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(TestConfig)
export default testContainer;