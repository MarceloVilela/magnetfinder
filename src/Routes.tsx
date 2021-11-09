import React from 'react'
import { BrowserRouter, Route } from 'react-router-dom'

import Main from './pages/Main'
import Post from './pages/Post'
import Trend from './pages/Trend'

export default function Routes() {
  return (
    <BrowserRouter>
      <Route path='/' component={Main} exact />
      <Route path='/post' component={Post} exact />
      <Route path='/trend' component={Trend} exact />
    </BrowserRouter>
  )
}