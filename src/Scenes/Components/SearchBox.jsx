import React, { Component } from 'react';
import { Input } from 'antd';

export default class SearcgBox extends Component {

  render() {
    return (
      <div >
        {/* <Search placeholder="input search text"
                allowClear onSearch={onSearch} 
                 /> */}

        <Input type="search"
          name="search"
          placeholder="Search..."
          style={{
            width: '42rem',
            border: 'transparent',
            fontsize: '1rem',
            Color: "#666873",
            backgroundColor: 'transparent',
            borderBottom: "1px solid #3e434d",
          }}
        />
      </div>

    );
  }
}