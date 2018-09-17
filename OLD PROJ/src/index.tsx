import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from 'client/App' // import the App component that we created earlier.
import registerServiceWorker from 'client/registerServiceWorker'

ReactDOM.render(<App />, document.getElementById('root'))
registerServiceWorker()