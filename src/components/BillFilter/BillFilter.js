import React from "react";
import styles from "./BillFilter.scss";
import FontIcon from "react-toolbox/lib/font_icon";
import PersonSelectorOverlay from "components/PersonSelectorOverlay";
import ListSelectOverlay from "components/ListSelectOverlay";
import {Avatar} from "components/Avatar";

export const BillFilter = React.createClass({

  onFilterModalClose: function () {
    this.setState({sortModalIsActive: false, filterModalIsActive: false});
  },

  onFilterModalOpen: function () {
    this.setState({sortModalIsActive: false, filterModalIsActive: true});
  },

  onSortModalClose: function () {
    this.setState({sortModalIsActive: false, filterModalIsActive: false});
  },

  onSortModalOpen: function () {
    this.setState({sortModalIsActive: true, filterModalIsActive: false});
  },

  render: function () {

    const {filterModalIsActive, sortModalIsActive} = this.state || {filterModalIsActive: false, sortModalIsActive: false};
    const {personNames, onFilterChange, onSortChange, currentFilter, currentSort, onReset} = this.props;

    const defaultFilter = currentSort == "Date" && currentFilter == "";

    const filter = currentFilter == ''
      ? (<b>All</b>)
      : (<span className={styles.personFilter}>
          <b>{currentFilter}</b>
          <Avatar name={currentFilter} size={20} fontSize={11}/>
        </span>);

    return (
      <div className={styles.container}>
        <PersonSelectorOverlay
          title={"Filter bills by"}
          active={filterModalIsActive} onFilterChange={onFilterChange} onClose={this.onFilterModalClose}
          names={personNames} canSelectAll={true}/>
        <ListSelectOverlay
          active={sortModalIsActive} onSortChange={onSortChange} onClose={this.onSortModalClose}
          title={"Sort by"} items={[{name: "Date", icon: "access_time"}, {name: "Amount", icon: "timeline"}]}
        />
        <div>
          <span onClick={onReset} style={{display: defaultFilter ? "none" : "inline"}}
                className={styles.filterIcon}><FontIcon value='clear'/></span>
          <span onClick={this.onSortModalOpen} className={styles.filter}>sort by <b>{currentSort}</b></span>
          <span onClick={this.onFilterModalOpen} className={styles.filter}>filter by {filter}</span>
        </div>
      </div>);
  },
});

BillFilter.propTypes = {
  personNames: React.PropTypes.array.isRequired,
  currentFilter: React.PropTypes.string.isRequired,
  currentSort: React.PropTypes.string.isRequired,
  onFilterChange: React.PropTypes.func.isRequired,
  onSortChange: React.PropTypes.func.isRequired,
  onReset: React.PropTypes.func.isRequired,
};

export default BillFilter
