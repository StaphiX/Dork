import React, { Component } from "react";

type TableProps = { columns : Array<string>, data : Array<any> };
type TableState = { columns : Array<string>, data : Array<any> };

export class Table extends Component<TableProps, TableState> 
{
    constructor(props) {
      super(props);
      this.state = {
        columns: props.columns,
        data: props.data
      };
  }

  render() {

  var tableHeaders = (<thead>
    <tr>
      {
        this.state.columns.map(function(column) 
        {
          return <th>{column}</th>; 
        })
      }
    </tr>
</thead>);

  var tableBody = this.state.data.map(function(row) {
    return (
      <tr>
        {this.state.columns.map(function(column) {
          return <td>{row[column]}</td>; })}
      </tr>); });

    return (
      <table>
        {tableHeaders}
        {tableBody}
      </table>
    )
  }
}