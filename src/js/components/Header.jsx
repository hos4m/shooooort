import React, { Component } from 'react';

export default class Header extends Component {
  render() {
    return (
      <header id="header">
        <h1><a href="/">Shooooort</a></h1>
        <span>The link shortener with a long name</span>
      </header>
    )
  }
}