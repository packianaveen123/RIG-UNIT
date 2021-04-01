import React, { Component } from 'react'
import { EditOutlined } from '@ant-design/icons';
import { Table, Space, Input, Popconfirm } from 'antd';
import { connect } from 'react-redux';
import { updateInputData, updateEditRowIndex } from '../../Redux/action';
import axios from 'axios';

const { Column } = Table;

class TableComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      EditMode: false,
      // editRowIndex: null,
      inputData: ''
    }
    this.updateInputValue = this.updateInputValue.bind(this);
  }

  handleButtonClick = (index) => {
    this.setState({
      EditMode: true,
      // editRowIndex: index
    })
    this.props.updateEditRowIndex(index);
  }

  updateInputValue = (event) => {
    this.setState
      ({
        inputData: event.target.value
      })
    this.props.updateInputData(event.target.value)
    console.log(event.target.value)
  }

  updateData = () => {
    axios.post('http://192.168.0.167:5000/testconfigedit.php', { testparamvalue: this.state.inputData })
      .then(res => {
        // if (res.data == "success") {

        // }
        // else { }
        console.log(res.data)
      }).catch(err => {
        console.log(err.res)
      })
  }
  static getDerivedStateFromProps(props, state) {
    return {
      data: props.data
    };
  }
  render() {
    const { data, EditMode } = this.state;
    const appData = this.props.app;
    const editRowIndex = this.props.app.editRowIndex;
    const inputData = this.props.app.inputData;

    data.forEach((it, index) => {
      it['Edit'] = <Space size="middle">
        <EditOutlined style={{ fontSize: '18px' }} onClick={() => this.handleButtonClick(index)} />
      </Space>
    })
    if (EditMode) {
      data.forEach((item, currentIndex) => {
        if (currentIndex === editRowIndex) {
          Object
            .keys(item)
            .map((it) => {
              if (it === 'Edit') {
                item[it] =
                  <span>
                    <a onClick={() => this.updateData('save')} style={{ marginRight: 8 }}>
                      Save
                    </a>
                    <Popconfirm title="Sure to cancel?" onConfirm={() => this.updateData('cancel')}>
                      <a>Cancel</a>
                    </Popconfirm>
                  </span>
              }
              else if (it === this.props.filters) {
                item[it] =
                  <Input
                    style={{ width: '300px' }}
                    defaultValue={item[it]}
                    value={this.state.it}
                    onChange={this.updateInputValue}
                  ></Input>
              }
              console.log(item.testparamvalue)
            })
        }
      })
    }
    let columns = []
    if ((data !== null || data !== undefined) && data.length > 0) {
      columns = Object.keys(data[0])
    }
    return (
      <div>
        <Table
          dataSource={data}
          style={{ backgroundColor: "#131633" }}
        >
          {
            columns && columns.length > 0 ?
              columns.map((col) => {
                return <Column title={col} key={col} dataIndex={col}
                />
              }) : []
          }

        </Table>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  app: state.app
})
const mapDispatchToProps = {
  updateInputData,
  updateEditRowIndex
}

const tablePage = connect(
  mapStateToProps,
  mapDispatchToProps
)(TableComponent)

export default tablePage;
