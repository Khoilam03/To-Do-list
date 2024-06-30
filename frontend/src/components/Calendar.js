import React, { Component } from 'react';

export default class Calendar extends Component {
  constructor(props) {
    super(props);
    const today = new Date();
    this.state = {
      today,
      currentWeek: this.getCurrentWeek(today)
    };
  }

  getCurrentWeek(today) {
    const firstDayOfWeek = today.getDate() - 6;
    const dates = [];
    for (let i = 0; i < 7; i++) {
      dates.push(new Date(today.getFullYear(), today.getMonth(), firstDayOfWeek + i));
    }
    return dates;
  }

  render() {
    const { today, currentWeek } = this.state;
    const { taskSummary } = this.props;
    const monthYearString = today.toLocaleString('default', { month: 'long', year: 'numeric' });

    return (
      <div className="calendar">
        <div className="header">
          <h2>{monthYearString}</h2>
        </div>
        <table>
          <thead>
            <tr>
              {currentWeek.map((date, index) => (
                <th key={index}>
                  {date.toLocaleString('default', { weekday: 'short' })}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              {currentWeek.map((date, index) => {
                const dateStr = date.toISOString().split('T')[0];
                const summary = taskSummary[dateStr];
                const totalTasks = summary ? summary.completed + summary.not_completed : 0;

                return (
                  <td
                    key={index}
                    className={date.toDateString() === today.toDateString() ? 'highlight' : ''}
                  >
                    {date.getDate()}
                    {summary && (
                      <div>
                        <p>{summary.completed}/{totalTasks}</p>
                      </div>
                    )}
                  </td>
                );
              })}
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}
