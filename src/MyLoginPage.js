// in src/MyLoginPage.js
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { userLogin } from 'admin-on-rest';

import './Login.css';

const aStyle = {
    position: 'absolute',
    left: 'calc(50% - 172px/2)',
    top: 'calc(50% - 43px/2)'
}

class MyLoginPage extends Component {
    submit = (e) => {
        e.preventDefault();
        // gather your data/credentials here
        const credentials = { };

        // Dispatch the userLogin action (injected by connect)
        this.props.userLogin(credentials);
    }

    render() {
        return (
            <a style={aStyle} href="https://slack.com/oauth/authorize?
                scope=files%3Awrite%3Auser+users%3Aread+files%3Aread+search%3Aread+channels%3Aread+groups%3Aread
                &client_id=231613720450.347038352342">
                <img alt="Sign in with Slack"
                height="40" width="172"
                src="https://platform.slack-edge.com/img/sign_in_with_slack.png"
                srcSet="https://platform.slack-edge.com/img/sign_in_with_slack.png 1x, https://platform.slack-edge.com/img/sign_in_with_slack@2x.png 2x" />
            </a>
        );
    }
};

export default connect(undefined, { userLogin })(MyLoginPage);