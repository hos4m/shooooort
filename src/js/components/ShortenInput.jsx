import React, { Component } from 'react';
import { Form, Button, FormControl } from 'react-bootstrap';
import swal from 'sweetalert2';
import storageHelper from 'storage-helper';

import HTTPRequest from '../helpers/API';

export default class ShortenInput extends Component {
  constructor() {
    super();
    this.state = {
      inputText: '',
      isSubmitting: false,
    }
  }


  handleLinkInputChange(event) {
    this.setState({ inputText: event.target.value });
  }


  shortenThisLink(e) {
    let Component = this;
    e.preventDefault();

    // Check if the submitted text if a URL or not
    let url = this.state.inputText;
    let urlPattern = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
    let urlRegex = new RegExp(urlPattern);

    if (url.match(urlRegex)) {
      // Disable the Shorten button untill the request is done
      this.setState({ isSubmitting: true });

      HTTPRequest.shorten(url)
        .then(function (response) {
          
          // Check for API response
          if (response.status === 200) {
            // Save the new link the browser localStorage
            let newLinkObj = {
              link: url,
              code: response.data.shortcode,
            };

            let savedLinksInLocalStorage = JSON.parse(storageHelper.getItem('savedLinks'));
            if (savedLinksInLocalStorage) {
              savedLinksInLocalStorage.push(newLinkObj);
              storageHelper.setItem('savedLinks', JSON.stringify(savedLinksInLocalStorage));
            } else {
              let savedLinksInLocalStorage = [];
              savedLinksInLocalStorage.push(newLinkObj);
              storageHelper.setItem('savedLinks', JSON.stringify(savedLinksInLocalStorage));
            }

            // Show success message in ase response state is OK
            swal({
              title: 'Link is shortened successfully',
              type: 'success',
              showCancelButton: false,
              buttonsStyling: false,
              timer: 2000,
              confirmButtonClass: 'btn-success',
            })
              .then(() => {
                Component.props.refreshLinksList();
                Component.setState({ isSubmitting: false });
              })
              .catch((error) => {
                Component.setState({ isSubmitting: false });
                console.log(error)
              })
          } else {
            // Show error message in ase response state is not OK
            swal({
              title: 'Please try again later',
              text: 'There has been an issue while shortening the URL.',
              type: 'error',
              showCancelButton: false,
              buttonsStyling: false,
            });

            Component.setState({ isSubmitting: false });
          }
        })
        .catch(function (error) {
          Component.setState({ isSubmitting: false });
          swal({
            title: 'Please try again later',
            text: 'There has been an issue while shortening the URL.',
            type: 'error',
            showCancelButton: false,
            buttonsStyling: false,
          });
          console.log(error);
        });
    } else {
      // Prompt the user with an alert if the typed text was not a correct URL
      swal({
        text: 'Please type a correct URL',
        type: 'error',
        showCancelButton: false,
        buttonsStyling: false,
      });
    }
  }
  

  render() {
    return (
      <Form className="ShortenInput" onSubmit={() => this.shortenThisLink()}>
        <FormControl
          type="text"
          placeholder="Paste the link you want to shorten here"
          bsClass=''
          autoFocus={true}
          value={this.state.inputText}
          onChange={this.handleLinkInputChange.bind(this)}
        />

        <FormControl
          type="submit"
          value="Shorten this link"
          bsClass=''
          onClick={this.shortenThisLink.bind(this)}
          disabled={this.state.isSubmitting}
        />
      </Form>
    )
  }
}