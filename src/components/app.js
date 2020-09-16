import { h } from 'preact';
import { Router } from 'preact-router';

import Header from './header';

// Code-splitting is automated for `routes` directory
import Home from '../routes/home';
import Country from '../routes/country';

const App = () => (
	<div id="app">
		<Header />
		<Router>
			<Home path="/" />
			<Country path="/countries/:code" />
		</Router>
	</div>
)

export default App;
