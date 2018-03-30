import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

const TableDefinitions = () => (
  <thead>
    <tr>
      <th scope="col">Precio</th>
      <th scope="col">Monto</th>
      <th scope="col" className="text-right">
        Valor
      </th>
    </tr>
  </thead>
);

const TableRow = order => (
  <tr>
    <td>${ order.price }</td>
    <td>{ order.amount }</td>
    <td className="text-right">
      ${ _.round(order.price * order.amount, 2).toFixed(2) }
    </td>
  </tr>
);

const Table = ({ label, orders }) => (
  <section className="col-5">
    <table className="table table-sm">
      <thead className="table-info">
        <tr><th colSpan="3">{ label }</th></tr>
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
  orders: PropTypes.arrayOf(PropTypes.object),
};

Table.defaultProps = {
  orders: [],
};

export default Table;
