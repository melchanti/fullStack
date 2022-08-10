const Notification = ({ errorMessage, notificationMessage }) => {
  if (errorMessage === null && notificationMessage === null) {
    return null
  }
  else if (errorMessage === null) {
    return (
      <div className="notification">
      {notificationMessage}
    </div>
    )
  }

  return (
    <div className="error">
      {errorMessage}
    </div>
  )
}

export default Notification