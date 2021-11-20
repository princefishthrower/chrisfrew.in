import * as React from 'react';
import { ColoredTitle } from '../../utils/ColoredTitle';
import { AllPostsWidget } from '../../utils/PostsWidgets/AllPostsWidget/AllPostsWidget';
import { Search } from '../../utils/search/Search';

export interface IPostsProps {
}

export function Posts (props: IPostsProps) {
  // TODO: graphql
  const totalPosts = 85;
  return (
    <>
      <ColoredTitle title="📜 All Posts From All Time"/>
      <Search/>
      <p style={{textAlign: 'center'}}>Search all <b>{totalPosts}</b> posts!</p>
      <AllPostsWidget/>
    </>
  );
}
