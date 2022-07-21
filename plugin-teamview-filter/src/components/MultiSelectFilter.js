import React from 'react';
import styled from 'react-emotion';
import Select from 'react-select';

import { isArraysEqual } from '../helper';

// Setting height to the max allowed for any individual filter
// to provide as much room as possible to the options list
const FilterContainer = styled('div')`
  height: 220px;
  margin-left: 16px;
  margin-right: 16px;
`;

export class MultiSelectFilter extends React.Component {
  state = {
    selectedOptions: []
  }
  elementId = `${this.props.name}-select`;

  selectStyles = {
    // Setting maxHeight to 53 to ensure the input field only expands
    // to two lines. If it grows beyond two lines, it will push the
    // menu list outside of the div and requiring scrolling the containing
    // div as well as the menu list itself to see all the options, which
    // could be confusing for the user
    valueContainer: (provided) => ({
      ...provided,
      maxHeight: 210,
      overflow: 'auto',
    }),
    control: (provided) => ({
      ...provided,
      borderRadius: 0,
      maxHeight: 213
    }),
    // Setting maxHeight to 150px to ensure that its height along with
    // the input container's height at two lines of selected options
    // doesn't exceed the height of the containing div
    menuList: (provided) => ({
      ...provided,
      maxHeight: '150px',
    }),
    menu: (provided) => ({
      ...provided,
      borderRadius: 0,
    })
  };

  componentDidUpdate() {
    const { currentValue } = this.props;

    if (currentValue === undefined &&
      (!this.state.selectedOptions ||
      this.state.selectedOptions.length > 0)
    ) {
      this.setState({ selectedOptions: [] });
    }
  }

  _handleChange = (e, v) => {
    this.setState({ selectedOptions: e });

    const newValue = Array.isArray(e) ? e.map(o => o.value) : [];
    this.props.handleChange(newValue);

    const valueContainer = document.querySelector(`.${this.props.name}__value-container`);
    // Without setting scrollTop, the most recently selected option can be hidden
    // until the user manually scrolls to the bottom of the value containers
    valueContainer.scrollTop = valueContainer.scrollHeight - valueContainer.clientHeight;
  }

  render() {
    const {
      isMultiSelect,
      name,
      options
    } = this.props;

    const isMulti = isMultiSelect === undefined ? true : isMultiSelect;
    return (
      <FilterContainer>
        <Select
          classNamePrefix={name}
          id={this.elementId}
          isClearable
          isMulti={isMulti}
          name={name}
          options={options}
          onChange={this._handleChange}
          styles={this.selectStyles}
          value={this.state.selectedOptions}
          menuShouldScrollIntoView
          menuPortalTarget={document.body}
          closeMenuOnSelect={false}
          noOptionsMessage={() => null}
          menuPlacement="auto"
        />
      </FilterContainer>
    )
  }
};

export const MultiSelectFilterLabel = ({ currentValue }) => {
  let label = 'Any';

  if (currentValue && currentValue?.label) {
    label = currentValue.label;
  }
  else if (Array.isArray(currentValue) && currentValue.length === 1) {
    label = `${currentValue[0]} only`;
  }
  else if (Array.isArray(currentValue) && currentValue.length > 1) {
    label = `${currentValue.length} selected`;
  }
  return (<>{label}</>);
};

