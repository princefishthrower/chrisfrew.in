import React from 'react'
import { rhythm, scale } from '../utils/typography'

const axios = require('axios');
let mojs;
try {
  mojs = require('mo-js');
} catch (e) {
  console.log(e)
}
const LIGHT_GOLD = "#fff099";
const GOLD = "gold";
const TRANSPARENT = "transparent";

class Star extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sClassName: "star",
      sOutlineFill: GOLD,
      sBodyFill: TRANSPARENT,
      sBodyStroke: GOLD,
      iLocalCount: 0,
      iGlobalCount: 0
    };
    this.getFavoriteInfo = this.getFavoriteInfo.bind(this);
    this.onClickStar = this.onClickStar.bind(this);
    this.onMouseOverStar = this.onMouseOverStar.bind(this);
    this.onMouseOutStar = this.onMouseOutStar.bind(this);
    this.onMouseDownStar = this.onMouseDownStar.bind(this);
    this.onMouseUpStar = this.onMouseUpStar.bind(this);
    this.getFavoriteInfo();
  }
  getFavoriteInfo() {
    console.log(this.props.starID);
    console.log(this.props.starID);
    
    axios.post(process.env.SERVER_URL + '/star-info', {
      starID: this.props.starID
    })
    .then((oResponse) => {
      console.log(oResponse.data)
      if (oResponse.data.bIsFavorite) {
        this.setState({ 
          sClassName: "star star-favorited",
          sOutlineFill: LIGHT_GOLD,
          sBodyFill: LIGHT_GOLD,
          sBodyStroke: LIGHT_GOLD,
          iLocalCount: parseInt(oResponse.data.iLocalCount, 0),
          iGlobalCount:  parseInt(oResponse.data.iGlobalCount, 0)
        }); // change style
      } else {
        this.setState({ 
          sClassName: "star",
          sOutlineFill: GOLD,
          sBodyFill: TRANSPARENT,
          sBodyStroke: GOLD,
          iLocalCount: 0,
          iGlobalCount:  parseInt(oResponse.data.iGlobalCount, 0)
        }); // change style
      }
    })
    .catch((oError) => {

    });
  }
  onClickStar() {
    console.log(this.state.iLocalCount)
    const iLocalCountPlusOne = this.state.iLocalCount + 1;
    const iGlobalCountPlusOne = this.state.iGlobalCount + 1;
    console.log(this.state.sOutlineFill);
    if (iLocalCountPlusOne <= 50) {
      console.log("adding to favorite count and adding favorite styles...");
      axios.post(process.env.SERVER_URL + '/star-add', {
        starID: this.props.starID
      })
      .then((oResponse) => {
        if (oResponse.data.bSuccessful) {
          this.setState({ 
            sClassName: "star star-favorited",
            sOutlineFill: LIGHT_GOLD,
            sBodyFill: LIGHT_GOLD,
            sBodyStroke: LIGHT_GOLD,
            iGlobalCount: iGlobalCountPlusOne
          }); // change style
          this._animationTimeline.replay()
          this.setState({
              iLocalCount: iLocalCountPlusOne,
              iGlobalCount: iGlobalCountPlusOne
          })
        }
      });
    } 
  }
  onMouseOverStar() {
    if (this.state.sBodyFill !== LIGHT_GOLD) {
      this.setState({
        sBodyFill: GOLD,
      }); // change style
    }
  }
  onMouseOutStar() {
    if (this.state.sBodyFill !== LIGHT_GOLD) {
      this.setState({
        sBodyFill: TRANSPARENT,
      }); // change style
    }
  }
  onMouseDownStar() {
    // const iInterval = setTimeout(() => {
    //   const iLocalCount = this.state.iLocalCount;
    //   const iGlobalCount = this.state.iGlobalCount;
    //   this._animationTimeline.replay()
    //   this.setState({
    //       iLocalCount: Math.min(iLocalCount + 1, 50),
    //       iGlobalCount: iGlobalCount + 1
    //   });
    // }, 300);
    // this.setState({iInterval: iInterval});
  }
  onMouseUpStar() {
    // clearInterval(this.state.iInterval);
    // this.setState({iInterval: null});
  }
  componentDidMount() {
    if (mojs) {
      const tlDuration = 300;
      const triangleBurst = new mojs.Burst({
        parent: '#star',
        radius: {50:95},
        count: 5,
        angle: 30,
        children: {
          shape: 'polygon',
          radius: {6: 0},
          scale: 1,
          stroke: 'gold',
          strokeWidth: 2,
          angle: 210,
          delay: 30,
          speed: 0.2,
          easing: mojs.easing.bezier(0.1, 1, 0.3 ,1),
          duration: tlDuration
        }
      })
      const circleBurst = new mojs.Burst({
        parent: '#star',
        radius: {50:75},
        angle: 25,
        duration: tlDuration,
        children: {
          shape: 'circle',
          fill: 'gold',
          delay: 30,
          speed: 0.2,
          radius: {3: 0},
          easing: mojs.easing.bezier(0.1, 1, 0.3, 1),
        }
      })
      const countAnimation = new mojs.Html({
        el: '#star--count',
        isShowStart: false,
        isShowEnd: true,
        y: {0: -30},
        opacity: {0:1},
        duration: tlDuration
      }).then({
        opacity: {1:0},
        y: -80,
        delay: tlDuration/2
      })
      const countTotalAnimation = new mojs.Html({
        el: '#star--count-total',
        isShowStart: false,
        isShowEnd: true,
        opacity: {0:1},
        delay: 3*(tlDuration)/2,
        duration: tlDuration,
        y: {0: -3}
      })
      const scaleButton = new mojs.Html({
        el: '#star',
        duration: tlDuration,
        scale: {1.3: 1},
        easing: mojs.easing.out
      })
      const star = document.getElementById('star')
      star.style.transform = "scale(1, 1)"
      this._animationTimeline = new mojs.Timeline()
      this._animationTimeline.add([
        countAnimation,
        countTotalAnimation,
        scaleButton,
        circleBurst,
        triangleBurst
      ])
    }
  }
  render () {
    const { sOutlineFill, sBodyFill, sBodyStroke, iGlobalCount, sClassName, iLocalCount } = this.state;
    return (
      <div onMouseOut={this.onMouseOutStar}>
        <div
          style={{
            ...scale(-1 / 5),
            display: 'inline-block',
            float: 'left',
            marginBottom: rhythm(-0.75),
            marginLeft: rhythm(0.5),
            width: rhythm(2)
          }}>
          <div id="star" onClick={this.onClickStar} onMouseOver={this.onMouseOverStar} onMouseDown={this.onMouseDownStar} onMouseOut={this.onMouseOutStar}>
            <svg className={sClassName} xmlns="http://www.w3.org/2000/svg" version="1" viewBox="0 -256 1792 1792">
              <path fill={sOutlineFill} d="M1198 799l306-297-422-62L893 58 704 440l-422 62 306 297-73 421 378-199 377 199zm527-357q0 22-26 48l-363 354 86 500 1 20q0 50-41 50-19 0-40-12l-449-236-449 236q-22 12-40 12-21 0-32-15-10-14-10-35l2-20 86-500L86 490q-25-27-25-48 0-37 56-46l502-73 225-455q19-41 49-41t49 41l225 455 502 73q56 9 56 46z"/>
              <path fill={sBodyFill} stroke={sBodyStroke} strokeWidth="49" strokeLinecap="round" strokeLinejoin="round" d="M522 1204l35-206 34-198-151-148-152-148 210-31 210-30 92-189 92-190 95 189 95 190 207 30 208 30-151 148-151 147 33 195 36 209c3 11-12 6-74-28l-189-99-110-57-107 57c-220 117-262 137-262 129z"/>
            </svg>
            <span id="star--count" className="star--count"><span>&nbsp;&nbsp;</span>+{iLocalCount}</span>
            <span id="star--count-total" className="star--count-total">{iLocalCount}</span>
          </div>
        </div>
        <div
          style={{
            ...scale(-1 / 5),
            display: 'inline-block',
            marginTop: rhythm(0.5),
            marginLeft: rhythm(0.5),
            float: 'left'
          }}>
          <span>
          {iGlobalCount}
          </span>
        </div>
        <br/>
        <br/>
        <span className="starsInfoText">Give me some gold stars if you like this post - max 50 :)</span>
        <br/>
        <span className="starsInfoText">Stolen from Medium? Nooooooo :)</span>
      </div>
    )
  }
}

export default Star;