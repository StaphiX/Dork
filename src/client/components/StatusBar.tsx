import React, { Component } from "react";
import { PlayerType } from "../../common/clientPlayer";

type StatusBarState = { playerType: PlayerType };

class StatusBar extends Component<any, StatusBarState> {
    constructor(props) {
      super(props);
      this.state = {
        playerType: props.playerType
      };
      console.log("Status Bar Created ", this.state);
      console.log("Status Bar Player ", this.state.playerType);
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

export default StatusBar;