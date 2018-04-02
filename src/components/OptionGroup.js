import React from 'react';
import PropTypes from 'prop-types';
import uuid from 'uuid/v4';

const OptionGroup = ({ options, current, onChange }) => {
  const OptionButton = (item) => {
    const activeClass = current === item.value ? 'active' : '';

    return (
      <label htmlFor={item.value} className={`btn btn-secondary ${activeClass}`} key={uuid()}>
        <input
          type="radio"
          name={item.value}
          id={item.value}
          value={item.value}
          onClick={() => { onChange(item.value); }}
        />
        { item.label }
      </label>
    );
  };

  return (
    <div className="btn-group btn-group-toggle" data-toggle="buttons">
      { options.map(OptionButton) }
    </div>
  );
};

OptionGroup.propTypes = {
  current: PropTypes.string,
  options: PropTypes.arrayOf(PropTypes.object).isRequired,
  onChange: PropTypes.func.isRequired,
};

OptionGroup.defaultProps = {
  current: '',
};

export default OptionGroup;
