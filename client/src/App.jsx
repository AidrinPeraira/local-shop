import { useState } from 'react'
import './App.css'
import { Typography, Button, Container } from '@mui/material'

function App() {

  console.log('hello')
  return (
    <>
    <Container/>
      <Typography>Hello Guys</Typography>
      <Typography variant="h4" gutterBottom>
          Welcome to My Material-UI App!
        </Typography>
        
        <Typography variant="h6" gutterBottom>
          This is a sample app demonstrating custom themes.
        </Typography>
        
        {/* Buttons with custom primary and secondary colors */}
        <Button color="primary" variant="contained" style={{ marginBottom: 20 }}>
          Primary Button
        </Button>
        
        <Button color="secondary" variant="contained">
          Secondary Button
        </Button>
    <Container/>
    </>
  )
}

export default App
