import React from 'react';
import PropTypes from 'prop-types';
import numeral from 'numeral';
import uuid from 'uuid/v4';

const TableDefinitions = () => (
  <thead>
    <tr>
      <th scope="col">Precio</th>
      <th scope="col">Monto</th>
      <th scope="col" className="text-right">
        Valor
      </th>
      <th scope="col" className="text-right">
        Suma
      </th>
    </tr>
  </thead>
);

const TableRow = order => (
  <tr key={uuid()}>
    <td>
      { numeral(order[0]).format('$0,0.00') }
    </td>
    <td>{ order[1] }</td>
    <td className="text-right">
      { numeral(order[0] * order[1]).format('$0,0.00') }
    </td>
    <td className="text-right">
      { numeral(order[2]).format('0,0.00') }
    </td>
  </tr>
);

const Table = ({ label, orders, type }) => (
  <section className="col-6">
    <table className="table">
      <thead>
        <tr className={`table-header table-header--${type}`}>
          <th colSpan="4">{ label }</th>
        </tr>
      </thead>
      <TableDefinitions />
      <tbody>
        { orders.map(TableRow) }
      </tbody>
    </table>
  </section>
);

Table.propTypes = {
  label: PropTypes.string.isRequired,
  orders: PropTypes.arrayOf(PropTypes.array),
  type: PropTypes.string,
};

Table.defaultProps = {
  orders: [],
  type: '',
};

export default Table;
