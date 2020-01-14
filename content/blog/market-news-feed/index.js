import React from 'react'
import Helmet from 'react-helmet'
import axios from 'axios'
import { rhythm, scale } from '../../utils/typography'
import io from 'socket.io-client'; // client side of socket
const sAPI_URL = 'https://chrisfrew.in/market-news-feed-api'; // path for http communication to port 9002
const sWS_URL = 'https://chrisfrew.in/market-news-feed-ws'; // path for websocket communication to port 9003
const socket = io.connect(sWS_URL); 

class MarketNews extends React.Component {    
    constructor() {
      super();
      this.state = {
        aListItems: []
      };
      this.setupNotifications = this.setupNotifications.bind(this);
      this.setupSocketEvents = this.setupSocketEvents.bind(this);
    }
    setupNotifications() {
      // ask the user for permission
      if (Notification.permission !== "granted") {
        Notification.requestPermission();
      }
    }
    setupSocketEvents() {
      socket.on('newNews', (oNewsItem) => {
        let aItems = this.state.aListItems;
        let oDate = new Date(oNewsItem.iUnixDateTime*1000);
        this.setState({ [oNewsItem.sId]: "newNewsNotification" });
        console.log(oNewsItem);
        aItems.unshift(<li key={oNewsItem.sId} className={this.state[oNewsItem.sId]}><a href={oNewsItem.sLink} target="_blank" rel="noopener noreferrer" className="newNewsNotification">{oNewsItem.sIdentifier}, {oDate.toLocaleString()}: {oNewsItem.sTitle}</a></li>);
        setTimeout(() => { this.setState({ [oNewsItem.sId]: "" }); }, 6000); // need to remove the animation class after it is done (5 seconds + 1 second buffer)
        this.setState({aListItems: aItems});
        if (Notification.permission === "granted") {
          new Notification("Breaking news: for " + oNewsItem.sIdentifier +  ":\"" + oNewsItem.sTitle + "\"");
        }
      });
      socket.on('mp3Data', (oStreamData) => {
        let oAudio = new Audio(oStreamData.sBase64);
        oAudio.play();
      });
    }
    render() {
      return (
        <div>
          <Helmet title="Market News Feed" />
          <h1>Market News Feed</h1>
          <p
            style={{
              ...scale(-1 / 5),
              display: 'block',
              marginBottom: rhythm(1),
              marginTop: rhythm(-1),
            }}
          >
            A live stream of Finviz news, so you don't have to refresh. Notifications can be enabled.
          </p>
          <ul>
            {this.state.aListItems}
          </ul>
        </div>
      );
    }
    componentDidMount() {
      this.setupNotifications();
      this.setupSocketEvents();
      let that = this;
      axios.get(sAPI_URL)
        .then(function (response) {
          let aItems = [];
          let oDate;
          response.data.forEach((oNewsItem, iIndex) => {
            oDate = new Date(oNewsItem.unix_time_released*1000);
            aItems.push(<li key={oNewsItem.id}><a href={oNewsItem.link} target="_blank" rel="noopener noreferrer">{oNewsItem.identifier}, {oDate.toLocaleString()}: {oNewsItem.title}</a></li>);
            if (iIndex + 1 === response.data.length) {
              that.setState({aListItems: aItems});
            }
          });
        })
        .catch(function (error) {
          that.setState({aListItems: [<li key="error">Error loading feed :(</li>]});
          console.log(error);
        });
    }
}

export default MarketNews