import React from 'react';
import './App.css';
import LiveChat from '@livechat/agent-app-widget-sdk';
import {
	compose,
	lifecycle,
	withStateHandlers,
	branch,
	renderNothing,
} from 'recompose';
import {pathEq, pathOr} from 'ramda';

const App = (props) => {
	console.log({props});
  return (
    <div className="App">
      <header className="App-header">
		  <p>CustomerId: <b>{pathOr('', ['livechatData', 'id'], props)}</b></p>
		  <p>ChatID: <b>{pathOr('', ['livechatData', 'chat','id'], props)}</b></p>
      </header>
    </div>
  );
};

const AppWaitForLiveChatInit = compose(
	withStateHandlers(
		{
			isReady: false,
			livechatData: {}
		},
		{
			setReady: () => bool => ({isReady: bool}),
			setLivechatData: () => data => ({livechatData: data})
		}
	),
	lifecycle({
		async componentDidMount() {
			try {
				await LiveChat.init();
				LiveChat.on('customer_profile', (data) => {
					this.props.setLivechatData(data);
				});
				LiveChat.on('customer_profile_hidden', (data) => {
					this.props.setLivechatData(data);
				});
			} catch (error) {
				console.error(error);
			} finally {
				this.props.setReady(true);

			}
		}
	}),
	branch(pathEq(['isReady'], false), renderNothing)
)(App);

export default AppWaitForLiveChatInit;
