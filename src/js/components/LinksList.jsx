import React, { Component } from 'react';
import { Grid, Table, OverlayTrigger, Tooltip } from 'react-bootstrap';
import swal from 'sweetalert2';
import storageHelper from 'storage-helper';
import copy from 'copy-text-to-clipboard';
import moment from 'moment';

import HTTPRequest from '../helpers/API';

export default class LinksList extends Component {
  constructor() {
    super();
    this.state = {
      savedLinks: [],
    }
  }


  componentDidMount() {
    this.syncSavedLinks();
  }

  /**
   * This is used to update the LinksList component when the ShortenInput Component updates
   */
  componentWillReceiveProps() {
    this.syncSavedLinks();
  }


  /**
   * A function to sync the saved links in the LocalStorage with the component's state
   */
  syncSavedLinks() {
    // Get the list of shortened links saved in the LocaStorage
    let savedLinksInLocalStorage = JSON.parse(storageHelper.getItem('savedLinks'));
    
    // Update the component's state with the previous list of links
    this.setState({ savedLinks: savedLinksInLocalStorage }, () => {
      
      // Update component's state links list with new data
      // afer hiting the stats API to get the number of visits and the last visit date
      if (this.state.savedLinks && this.state.savedLinks.length > 0) {
        let newLinksList = this.state.savedLinks.reverse().slice();

        let savedLinksPromise = this.state.savedLinks.map((link, index) => {
          return HTTPRequest.getLinkStats(link.code)
            .then((response) => {
              newLinksList[index].stats = response.data;
            })
            .catch((error) => {
              console.log(error);
            });
        });

        Promise.all(savedLinksPromise).then(() => {
          this.setState({ savedLinks: newLinksList })
        })
      }
    });
  }


  /**
   * A function to clear the saved links in the LocalStorage:
   * - No inputs required
   * - The funtion fires an alert to confirm with the user to remove or not
   * - After confirmation, the 'savedLinks' array of objects in the LocalStorage containing the list of links will be removed
   */
  clearSavedLinks() {
    if (this.state.savedLinks && this.state.savedLinks.length > 0) {
      swal({
        title: 'Are you sure?',
        text: 'Shortened links will be removed permanently',
        type: 'warning',
        showCancelButton: true,
        buttonsStyling: false,
        confirmButtonText: 'Yes, delete it!',
        confirmButtonClass: 'btn-success',
        cancelButtonText: 'No, keep it',
        cancelButtonClass: 'btn-warning'
      }).then(() => {
        storageHelper.removeItem('savedLinks');
        
        swal({
          title: 'Deleted!',
          text: 'Your saved links has been deleted.',
          type: 'success',
          buttonsStyling: false
        });

        this.syncSavedLinks();
      }, (dismiss) => {
        if (dismiss === 'cancel') {
          swal({
            title: 'Cancelled',
            text: 'Your saved links are safe.',
            type: 'error',
            buttonsStyling: false
          })
        }
      });
    } else {
      swal({
        text: 'There is no links to remove',
        type: 'warning',
        showCancelButton: false,
        buttonsStyling: false,
      })
    }
  }

  
  /**
   * A function used to copy the full shorten link when the user clicks on the link element
   * @param {string} code: the shorten code of the link
   */
  copyLink(code) {
    copy(`http://gymia-shorty.herokuapp.com/${code}`);
    swal({
      text: 'Shortened link is now copied to your clipboard',
      type: 'success',
      showCancelButton: false,
      buttonsStyling: false,
      timer: 2000
    })
      .then(() => {})
      .catch((error) => {
        console.log(error);
      });
  }


  render() {
    const linkTooltip = (<Tooltip id="tooltip">Click to copy this link</Tooltip>);

    return (
      <Grid bsClass="row" className="linksList">
        <header>
          <h2>Previously shortened by you</h2>
          {this.state.savedLinks && this.state.savedLinks.length > 0 &&
            <span onClick={this.clearSavedLinks.bind(this)}>Clear history</span>
          }
        </header>

        {this.state.savedLinks && this.state.savedLinks.length > 0 && 
          <Table className="linksList__table">
            <thead>
              <tr>
                <th className="bigColumn">Links</th>
                <th className="normalColumn">Visits</th>
                <th className="normalColumn">Last Visited</th>
              </tr>
            </thead>
            <tbody>
              {this.state.savedLinks && this.state.savedLinks.reverse().map((link) => {
                return [(
                  <tr>
                    <td className="bigColumn">
                      <OverlayTrigger placement="right" overlay={linkTooltip}>
                        <p className="shortenedLink" onClick={() => this.copyLink(link.code)}>
                          http://gymia-shorty.herokuapp.com/<span>{link.code}</span>
                        </p>
                      </OverlayTrigger>
                      <p className="fullLink">{link.link}</p>
                    </td>
                    <td className="normalColumn">
                      {link.stats ? link.stats.redirectCount : '–'}
                    </td>
                    <td className="normalColumn">
                      {link.stats ? moment(link.stats.lastSeenDate).fromNow() : '–'}
                    </td>
                  </tr>
                )]
              })}
            </tbody>
          </Table>
        }

        {(!this.state.savedLinks || this.state.savedLinks.length === 0) && 
          <p className="noSavedLinksNote">
            There is no saved links, go ahead and shorten your long links above!
          </p>
        }
      </Grid>
    )
  }
}