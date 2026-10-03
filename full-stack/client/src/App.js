import React, { useState, useEffect } from 'react'
import ActivityDisplay from './components/ActivityDisplay'
import Choices from './components/Choices'
import StoredActivities from './components/StoredActivities'
import DeleteActivities from './components/DeleteActivities'
import activityService from './services/activities'

import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

function App() {
  const [activities, setActivities] = useState([])
  const [newActivity, setNewActivity] = useState('')

  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const showError = error => setError(error.response?.data?.error || 'The request failed. Please try again.');

  useEffect(() => {
    activityService.getAllActivities().then(data => setActivities(data.activities)).catch(showError);
    activityService.getNewActivity().then(data => setNewActivity(data.activity)).catch(showError);
  }, []);

  const handleNewActivity = async () => {
    setBusy(true);
    setError('');
    try { setNewActivity((await activityService.getNewActivity()).activity); }
    catch (error) { showError(error); }
    finally { setBusy(false); }
  };

  const handleAddActivity = async activity => {
    setBusy(true);
    setError('');
    try {
      await activityService.addActivity({ activity });
      setActivities((await activityService.getAllActivities()).activities);
      setNewActivity((await activityService.getNewActivity()).activity);
    } catch (error) { showError(error); }
    finally { setBusy(false); }
  };

  const handleDeleteActivities = async () => {
    setBusy(true);
    setError('');
    try {
      await activityService.deleteAllActivities();
      setActivities([]);
    } catch (error) { showError(error); }
    finally { setBusy(false); }
  };

  return (
    <div className='container'>
      <Container>
        {error && <p role="alert">{error}</p>}
        <Row id="first-row">
          <Col>
            <ActivityDisplay name={newActivity}/>
          </Col>
        </Row>
        <Row id="second-row">
          <Col> 
            <Choices busy={busy} handleNewActivity={handleNewActivity} handleAddActivity={handleAddActivity} name={newActivity}/>
          </Col>
        </Row>
        <Row>
          <Col>
            <ul>
              <h2>Today's Activities: {activities.length}</h2>
              <StoredActivities list={activities} />
            </ul>
          </Col>
        </Row>
        <Row id="fourth-row">
          <Col>
            <DeleteActivities busy={busy} handleDeleteActivities={handleDeleteActivities} />
          </Col>
        </Row>
      </Container>
    </div>
    
  );
}

export default App;
