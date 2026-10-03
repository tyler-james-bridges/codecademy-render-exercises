import React from 'react'

const Choices = ({ handleNewActivity, handleAddActivity, name, busy }) => {

  return (
    <div>
      <button id="primary-btn" disabled={busy} onClick={() => handleNewActivity()}>No thanks...</button>
      <button id="success-btn" disabled={busy || !name} onClick={() => handleAddActivity(name)}>Sounds fun!</button>
      
    </div>
  )
}

export default Choices