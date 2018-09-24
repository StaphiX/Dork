import React, { Component } from "react";
import { PlayerType } from "../clientPlayer";

class Host extends Component {
    constructor(props) {
      super(props);
      this.state = {
        playerList: null
      };
  }

  componentWillReceiveProps(nextProps)
  {
    this.setState({playerType: nextProps.playerType});
  }
  
  getBackgroundCol() {
    var col = "grey";
    var playerType = this.state.playerType;

    if(playerType !== undefined && playerType !== null && playerType !== PlayerType.NONE)
    {
      if(playerType === PlayerType.HOST)
        col = "red";
      else if(playerType === PlayerType.MASTER)
        col = "green";
      else if(playerType === PlayerType.PLAYER)
        col = "blue";
    }

    return col;
  }

  render() {
    console.log("Current Status ", this.state);

    return (
      <div style={{ width: "100%", height: "50px", backgroundColor: this.getBackgroundCol() }}>
      </div>
    )
  }
}

export default Host;