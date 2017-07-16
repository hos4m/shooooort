import React, { Component } from 'react';
import { Grid } from 'react-bootstrap';

import Header from '../components/Header.jsx';
import ShortenInput from '../components/ShortenInput.jsx';
import LinksList from '../components/LinksList.jsx';
let HomeRef = null;

export default class Home extends Component {
  constructor() {
    super();
    this.state = {};
  }

  componentDidMount() {
    HomeRef = this;
  }

  refreshLinksList() {
    HomeRef.setState({});
  }

  render() {
    return (
      <Grid bsClass='container'>
        <Grid bsClass='col-lg-7 center-block'>
          <Header />
          <ShortenInput refreshLinksList={this.refreshLinksList} />
          <LinksList />
        </Grid>
      </Grid>
    )
  }
}