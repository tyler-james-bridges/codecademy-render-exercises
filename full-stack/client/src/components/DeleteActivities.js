import React from 'react'

const DeleteActivities = ({ handleDeleteActivities, busy }) => {
  return (
    <button id="danger-btn" disabled={busy} onClick={() => handleDeleteActivities()}>Clear Activities</button>
  )
}

export default DeleteActivities