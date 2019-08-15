import React from "react";
import moment from "moment";
import { connect } from "react-redux";
import "./App.css";
// Components
import LineChart from "./components/LineChart/LineChart";
import ToolTip from "./components/ToolTip/ToolTip";
import InfoBox from "./components/InfoBox/InfoBox";

class App extends React.Component {
  /*   constructor(props) {
    super(props);
    this.state = {
      fetchingData: true,
      data: null,
      hoverLoc: null,
      activePoint: null
    };
  } */

  handleChartHover(hoverLoc, activePoint) {
    this.setState({
      hoverLoc: hoverLoc,
      activePoint: activePoint
    });
  }

  componentDidMount() {
    const getData = () => {
      const url = "https://api.coindesk.com/v1/bpi/historical/close.json";
      fetch(url)
        .then(r => r.json())
        .then(bitcoinData => {
          const sortedData = [];
          let count = 0;
          for (let date in bitcoinData.bpi) {
            sortedData.push({
              d: moment(date).format("MMM DD"),
              p: bitcoinData.bpi[date].toLocaleString("us-EN", {
                style: "currency",
                currency: "USD"
              }),
              x: count, //previous days
              y: bitcoinData.bpi[date] // numerical price
            });
            count++;
          }
          this.setState({
            data: sortedData,
            fetchingData: false
          });
        })
        .catch(e => {
          console.log(e);
        });
    };
    getData();
  }

  render() {
    return (
      <div className="container">
        <div className="row">
          <h1>Bitcoin Price Index Chart - 30 Days</h1>
        </div>
        <div className="row">
          {!this.state.fetchingData ? <InfoBox data={this.state.data} /> : null}
        </div>
        <div className="row">
          <div className="popup">
            {this.state.hoverLoc ? (
              <ToolTip
                hoverLoc={this.state.hoverLoc}
                activePoint={this.state.activePoint}
              />
            ) : null}
          </div>
        </div>
        <div className="row">
          <div className="chart">
            {!this.state.fetchingData ? (
              <LineChart
                data={this.state.data}
                onChartHover={(a, b) => this.handleChartHover(a, b)}
              />
            ) : null}
          </div>
        </div>
        {/* <div className="row">
          <div id="coindesk">
            {" "}
            Powered by <a href="http://www.coindesk.com/price/">CoinDesk</a>
          </div>
        </div> */}
      </div>
    );
  }
}
// mapStateToProps
const mapStateToProps = state => {
  console.log("Logging State: ", state);
  return {
    fetchingData: state.fetchingData,
    data: state.data,
    hoverLoc: state.hoverLoc,
    activePoint: state.activePoint,
    currentPrice: state.currentPrice,
    monthChangeD: state.monthChangeD,
    monthChangeP: state.monthChangeP,
    updatedAt: state.updatedAt
  };
};

export default connect(
  mapStateToProps,
  {}
)(App);
