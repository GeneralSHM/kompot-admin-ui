import React, { Component } from 'react';
import './itemRow.css';
import Select from 'react-select';

class ItemRow extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      selectedOption: '',
    };

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange = (selectedOption) => {
    this.setState({ selectedOption });
    console.log(`Selected: ${selectedOption.label}`);
  };

  render() {
    const { selectedOption } = this.state;
    return (
      <div className="itemRow">
        <Select
          name="form-field-name"
          value={selectedOption}
          onChange={this.handleChange}
          options={[
            { value: 'one', label: 'One' },
            { value: 'two', label: 'Two' },
          ]}
        />
      </div>
    );
  };
}

export default ItemRow;