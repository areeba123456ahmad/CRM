import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Card, Row, Col, ProgressBar, Spinner } from "react-bootstrap";
import './SS.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function TeamPerformance() {
  const [teamPerformance, setTeamPerformance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetching team performance data
    const fetchTeamPerformance = async () => {
      try {
        const response = await axios.get("http://localhost:5000/sales/team-performance");
        setTeamPerformance(response.data.team_performance);
      } catch (err) {
        setError("Error fetching team performance data.");
      } finally {
        setLoading(false);
      }
    };

    fetchTeamPerformance();
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <Spinner animation="border" variant="primary" />
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <Container style={{ marginBottom: "350px" }}>
      <h1 className="dashboard-title">Sales Team Performance</h1>
      <Row>
        {teamPerformance.map((agent, index) => (
          <Col key={index} sm={12} md={6} lg={4}>
            <Card className="team-performance-card">
              <Card.Body>
                <Card.Title>Agent Name: {agent.agent_name}</Card.Title>
                <Card.Text>
                  <strong>Total Sales:</strong> {agent.total_sales}
                </Card.Text>
                <Card.Text>
                  <strong>Sales Target:</strong> {agent.sales_target}
                </Card.Text>
                <Card.Text>
                  <strong>Fulfillment Rate:</strong> {agent.fulfillment_rate}%
                </Card.Text>
                <ProgressBar
                  now={agent.fulfillment_rate}
                  label={`${agent.fulfillment_rate}%`}
                  variant={agent.fulfillment_rate < 50 ? "danger" : agent.fulfillment_rate < 80 ? "warning" : "success"}
                />
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default TeamPerformance;
