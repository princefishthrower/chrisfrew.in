import React from 'react'
import { Link } from 'gatsby'
import get from 'lodash/get'
import Helmet from 'react-helmet'
import Bio from '../components/Bio'
import Layout from '../components/layout'
import { rhythm } from '../utils/typography'
import { graphql } from "gatsby"
import { Snowflakes } from 'xn-snowflakes';

require('prismjs/themes/prism-okaidia.css');
require('../styles/styles.css');

const ALL = 'all';
const aColors = ['#F92672', '#66D9EF', '#A6E22E'];
const aTags = [ALL, 'dev', 'life', 'misc'];

class BlogIndex extends React.Component {
  constructor() {
    super();
    this.state = {
      snow: false,
      sPostTypeFilter: null
    }
    this.pauseSnow = this.pauseSnow.bind(this);
    this.onClickFilter = this.onClickFilter.bind(this);
    this.getFilterParameter = this.getFilterParameter.bind(this);
    this.getFilterParameter();
  }
  getFilterParameter() {
    let oURL;
    if (typeof window !== 'undefined') {
      oURL = new URL(window.location.href);
      if (oURL.searchParams.get("post-type")) {
        this.state.sPostTypeFilter = oURL.searchParams.get("post-type");
      } else {
        this.state.sPostTypeFilter = "dev"; // default to dev
      }
    }
  }
  pauseSnow() {
    this.state.snow.pause();
  }
  onClickFilter(sFilter) {
    if (typeof window !== 'undefined') {
      window.history.pushState('', '', '/?post-type=' + sFilter);
    }
    if (sFilter === ALL) {
      this.setState({sPostTypeFilter: null});
    } else {
      this.setState({sPostTypeFilter: sFilter});
    }
  }
  render() {
    console.log("render yo!!!!");
    let aLis = [];
    let i = 0;
    let sColor = '';
    const { sPostTypeFilter } = this.state;
    const siteTitle = get(this, 'props.data.site.siteMetadata.title')
    const posts = [ // combine both post types
      ...this.props.data.allMarkdownRemark.edges,
      ...this.props.data.allJavascriptFrontmatter.edges,
    ]
    let sortedPosts = posts.sort((a, b) => { // need to sort because markdown posts and JS posts are queried seperately
      return new Date(b.node.frontmatter.date) - new Date(a.node.frontmatter.date);
    });
    if (sPostTypeFilter !== "" && sPostTypeFilter !== null && sPostTypeFilter !== ALL) { // now also filter by post type, if it was given
      sortedPosts = sortedPosts.filter(oPost =>  oPost.node.frontmatter.postType === sPostTypeFilter);
    }
    aTags.forEach((sTag, iIndex) => {
      let sText = '';
      if (sTag === ALL) {
        sText = sTag;
      } else {
        sText = '#' + sTag;
      }
      if (sTag === sPostTypeFilter) { // active button!
        aLis.push(
          <li key={iIndex}>
            <button className="selected" disabled>{sText}</button>
          </li>
        )
      } else { // non-active button
        aLis.push(
          <li key={iIndex}>
            <button className="selectable" onClick={() => this.onClickFilter(sTag)}>{sText}</button>
          </li>
        )
      }
    });
    return (
      <div>
        <Layout location={this.props.location}>
          <Helmet title={siteTitle} />
            <div
              style={{
                marginLeft: 'auto',
                marginRight: 'auto',
                maxWidth: rhythm(24),
                padding: `${rhythm(1.5)} ${rhythm(3 / 4)}`,
              }}
            >
          <Bio />
          <br/>
          <div className="postFilterText">
            <span>
            Filter posts by tag: 
            </span>
            { typeof window !== 'undefined' && window.innerWidth <= 600 && <div><br/></div> }
            <ul className="postFilterList">
              {aLis}
            </ul>
          </div>
          { sortedPosts.map(({ node }) => {
            if (node.frontmatter.draft) {
              return null; // if the markdown is still a 'draft post'
            }
            if (i === aColors.length) {
              i = 0;
            }
            sColor = aColors[i];
            i = i + 1;
            const title = get(node, 'frontmatter.title') || node.fields.slug
            return (
              <div key={node.fields.slug}>
                <Link style={{ boxShadow: 'none', color: 'black' }} to={node.fields.slug} onClick={this.pauseSnow}>
                <h2
                  style={{
                    marginBottom: rhythm(1 / 4),
                    color: sColor,
                    fontWeight: 1200
                  }}
                >
                    {title}
                </h2>
                <small>{node.frontmatter.date}</small>
                <br/>
                <small>#{node.frontmatter.postType}</small>
                <p dangerouslySetInnerHTML={{ __html: node.excerpt }} />
                </Link>
              </div>
            )
          })}
        </div>
      </Layout>
    </div>
    )
  }
  static getDerivedStateFromProps(props, state) {
    if (!state.snow && typeof window !== 'undefined') {
      return {
        snow: new Snowflakes() 
      }
    }
    return null; // standard if we didn't change state to return null that nothing has changed
  }
  componentDidMount() {
    // start fullscreen snow fall
    this.state.snow.start();
  }
}

export default BlogIndex

export const pageQuery = graphql`
  query IndexQuery {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
      edges {
        node {
          fields {
            slug
          }
          frontmatter {
            date(formatString: "DD MMMM, YYYY")
            title
            draft
            postType
          }
        }
      }
    }
    allJavascriptFrontmatter {
      edges {
        node {
          fields {
            slug
          }
          frontmatter {
            date(formatString: "DD MMMM, YYYY")
            title
            draft
            postType
          }
        }
      }
    }
  }
`
