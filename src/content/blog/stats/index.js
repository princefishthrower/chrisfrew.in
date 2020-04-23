import { rhythm } from '../../utils/typography';
import { Link } from 'gatsby';

const React = require('react');

const aMonthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

class Post extends React.Component {
  constructor() {
    super();
    this.state = {
      oDate: new Date()
    };
  }
  render () {
    const { oDate } = this.state;
    return (
      <div className="postBackground">
        <div
          style={{
            marginLeft: 'auto',
            marginRight: 'auto',
            maxWidth: rhythm(24),
            padding: `${rhythm(1.5)} ${rhythm(3 / 4)}`,
          }}
        >
        <h3
          style={{
            fontFamily: 'Montserrat, sans-serif',
            marginTop: 0,
            marginBottom: rhythm(-1),
          }}
        >
          <Link
            style={{
              boxShadow: 'none',
              textDecoration: 'none',
              color: 'inherit',
            }}
            to={'/'}
          >
          <div>
            Chris'<br/>
            <span style={{color:'#F92672'}}>Full</span><br/>
            <span style={{color:'#66D9EF'}}>Stack</span><br/>
            <span style={{color:'#A6E22E'}}>Blog</span>.<br/>
            <br/>
          </div>
          </Link>
        </h3>
          <h1>chrisfrew.in Blog Stats</h1>
          <p className="jsPostsDate"><i>As of {oDate.getDate()} {aMonthNames[oDate.getMonth()]}, {oDate.getFullYear()}</i></p>
          <h2>General Stats</h2>
          Number of Posts created in 2017: 9
          <br/>
          Number of Posts created in 2018: 27 (and counting - the year's not quite over!)
          <h2>Tag Stats</h2>
          Number of Posts with #dev tag: 24
          <br/>
          Number of Posts with #life tag: 4
          <br/>
          Number of Posts with #misc tag: 6
          <br/>
          Number of Posts with #blog tag: 2
          <br/>
          Total Number of Posts: 36
        </div>
      </div>
    )
  }
}

// front matter, javascript style
export const frontmatter = {
  title: "Blog Stats",
  description: "Blog Stats",
  date: "2018-10-12",
  draft: false,
  starID: 28,
  postType: "dev"
}

export default Post;
