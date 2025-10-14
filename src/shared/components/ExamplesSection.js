import React, { useState, useEffect } from 'react';

// Pre-loaded example templates
const PRE_LOADED_EXAMPLES = [
  {
    id: 'single-no-children',
    name: 'Single Person, No Children',
    description: 'Basic Universal Credit for a single person with no housing costs or children',
    isPredefined: true,
    formData: {
      taxYear: '2025_26',
      circumstances: 'single',
      age: 25,
      housingStatus: 'no_housing_costs',
      employmentType: 'not_working',
      monthlyEarnings: 0,
      hasChildren: false,
      children: 0,
      hasSavings: 'no',
      area: 'england'
    },
    expectedResult: '£311.68 per month'
  },
  {
    id: 'couple-with-children',
    name: 'Couple with 2 Children',
    description: 'Couple with 2 children, renting privately, one person working part-time',
    isPredefined: true,
    formData: {
      taxYear: '2025_26',
      circumstances: 'couple',
      age: 28,
      partnerAge: 30,
      housingStatus: 'renting',
      tenantType: 'private',
      rent: 1200,
      rentPeriod: 'per_month',
      bedrooms: 3,
      employmentType: 'employed',
      monthlyEarnings: 800,
      monthlyEarningsPeriod: 'per_month',
      partnerEmploymentType: 'not_working',
      hasChildren: true,
      children: 2,
      childAges: [5, 8],
      childGenders: ['female', 'male'],
      childDisabilities: [false, false],
      hasSavings: 'no',
      area: 'england'
    },
    expectedResult: 'Varies by location and LHA rates'
  },
  {
    id: 'single-parent-disabled',
    name: 'Single Parent with Disability Benefits',
    description: 'Single parent with 1 child, receiving PIP, working part-time',
    isPredefined: true,
    formData: {
      taxYear: '2025_26',
      circumstances: 'single',
      age: 32,
      housingStatus: 'renting',
      tenantType: 'social',
      rent: 600,
      rentPeriod: 'per_month',
      bedrooms: 2,
      employmentType: 'employed',
      monthlyEarnings: 600,
      monthlyEarningsPeriod: 'per_month',
      isDisabled: 'yes',
      claimsDisabilityBenefits: 'yes',
      disabilityBenefitType: 'pip',
      pipDailyLivingRate: 'standard',
      pipMobilityRate: 'standard',
      hasChildren: true,
      children: 1,
      childAges: [7],
      childGenders: ['male'],
      childDisabilities: [false],
      hasSavings: 'no',
      area: 'england'
    },
    expectedResult: 'Higher due to disability elements'
  },
  {
    id: 'self-employed-couple',
    name: 'Self-Employed Couple',
    description: 'Couple where one is self-employed, no children, private rent',
    isPredefined: true,
    formData: {
      taxYear: '2025_26',
      circumstances: 'couple',
      age: 35,
      partnerAge: 33,
      housingStatus: 'renting',
      tenantType: 'private',
      rent: 900,
      rentPeriod: 'per_month',
      bedrooms: 2,
      employmentType: 'self-employed',
      monthlyEarnings: 1200,
      monthlyEarningsPeriod: 'per_month',
      partnerEmploymentType: 'not_working',
      hasChildren: false,
      children: 0,
      hasSavings: 'no',
      area: 'england'
    },
    expectedResult: 'Subject to MIF rules and work allowances'
  },
  {
    id: 'homeowner-1-child-minimal-uc',
    name: 'Homeowner Single Parent - £1 UC (1 Child)',
    description: 'Single parent homeowner with 1 child earning just enough to qualify for £1/month UC',
    isPredefined: true,
    formData: {
      taxYear: '2025_26',
      circumstances: 'single',
      age: 30,
      housingStatus: 'no_housing_costs',
      employmentType: 'employed',
      monthlyEarnings: 2511.23,
      monthlyEarningsPeriod: 'per_month',
      hasChildren: true,
      children: 1,
      childAges: [8],
      childGenders: ['female'],
      childDisabilities: [false],
      hasSavings: 'no',
      area: 'england'
    },
    expectedResult: '£1.00 per month (annual earnings: £30,135)'
  },
  {
    id: 'homeowner-2-children-minimal-uc',
    name: 'Homeowner Single Parent - £1 UC (2 Children)',
    description: 'Single parent homeowner with 2 children earning just enough to qualify for £1/month UC',
    isPredefined: true,
    formData: {
      taxYear: '2025_26',
      circumstances: 'single',
      age: 32,
      housingStatus: 'no_housing_costs',
      employmentType: 'employed',
      monthlyEarnings: 3282.78,
      monthlyEarningsPeriod: 'per_month',
      hasChildren: true,
      children: 2,
      childAges: [6, 10],
      childGenders: ['male', 'female'],
      childDisabilities: [false, false],
      hasSavings: 'no',
      area: 'england'
    },
    expectedResult: '£1.00 per month (annual earnings: £39,393)'
  },
  {
    id: 'homeowner-3-children-minimal-uc',
    name: 'Homeowner Single Parent - £1 UC (3 Children)',
    description: 'Single parent homeowner with 3 children earning just enough to qualify for £1/month UC',
    isPredefined: true,
    formData: {
      taxYear: '2025_26',
      circumstances: 'single',
      age: 35,
      housingStatus: 'no_housing_costs',
      employmentType: 'employed',
      monthlyEarnings: 4054.32,
      monthlyEarningsPeriod: 'per_month',
      hasChildren: true,
      children: 3,
      childAges: [5, 9, 12],
      childGenders: ['female', 'male', 'female'],
      childDisabilities: [false, false, false],
      hasSavings: 'no',
      area: 'england'
    },
    expectedResult: '£1.00 per month (annual earnings: £48,652)'
  }
];

function ExamplesSection({ isVisible = false, onToggleVisibility, onLoadExample }) {
  const [userExamples, setUserExamples] = useState([]);
  const [editingExample, setEditingExample] = useState(null);
  const [newExampleName, setNewExampleName] = useState('');
  const [showCreateExample, setShowCreateExample] = useState(false);
  const [exampleName, setExampleName] = useState('');
  const [exampleDescription, setExampleDescription] = useState('');
  const [currentFormData, setCurrentFormData] = useState(null);
  const [currentResults, setCurrentResults] = useState(null);

  useEffect(() => {
    // Load user-created examples from localStorage
    const saved = localStorage.getItem('ucUserExamples');
    if (saved) {
      try {
        setUserExamples(JSON.parse(saved));
      } catch (error) {
        console.error('Error loading user examples:', error);
        setUserExamples([]);
      }
    }
  }, []);

  // Accept current form data and results for creating new examples
  useEffect(() => {
    if (window.currentCalculatorData) {
      setCurrentFormData(window.currentCalculatorData.formData);
      setCurrentResults(window.currentCalculatorData.results);
    }
  }, [isVisible]);

  const saveUserExamples = (examples) => {
    localStorage.setItem('ucUserExamples', JSON.stringify(examples));
    setUserExamples(examples);
  };

  const handleCreateExample = () => {
    if (!exampleName.trim() || !currentFormData || !currentResults) {
      return;
    }

    const newExample = {
      id: `user-${Date.now()}`,
      name: exampleName.trim(),
      description: exampleDescription.trim() || 'User-created example',
      isPredefined: false,
      formData: { ...currentFormData },
      results: { ...currentResults },
      timestamp: new Date().toISOString(),
      expectedResult: currentResults.calculation ?
        `£${currentResults.calculation.finalAmount.toFixed(2)} per month` :
        'Calculation available'
    };

    const updated = [...userExamples, newExample];
    saveUserExamples(updated);

    // Reset form
    setExampleName('');
    setExampleDescription('');
    setShowCreateExample(false);
  };

  const handleDeleteExample = (exampleId) => {
    if (window.confirm('Are you sure you want to delete this example?')) {
      const updated = userExamples.filter(ex => ex.id !== exampleId);
      saveUserExamples(updated);
    }
  };

  const handleRenameExample = (exampleId, newName) => {
    if (!newName.trim()) return;

    const updated = userExamples.map(ex =>
      ex.id === exampleId ? { ...ex, name: newName.trim() } : ex
    );
    saveUserExamples(updated);
    setEditingExample(null);
  };

  const handleLoadExample = (example) => {
    if (onLoadExample) {
      // For predefined examples, only pass formData (no results to force recalculation)
      if (example.isPredefined) {
        onLoadExample(example.formData, null);
      } else {
        // For user examples, pass both formData and results
        onLoadExample(example.formData, example.results);
      }
    }
    if (onToggleVisibility) {
      onToggleVisibility();
    }
  };

  const formatDateTime = (timestamp) => {
    return new Date(timestamp).toLocaleString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getFormDataSummary = (formData) => {
    const circumstances = formData.circumstances === 'single' ? 'Single' : 'Couple';
    const housing = formData.housingStatus === 'no_housing_costs' ? 'No housing costs' :
                   formData.housingStatus === 'renting' ? 'Renting' :
                   formData.housingStatus === 'mortgage' ? 'Mortgage' : formData.housingStatus;
    const children = formData.hasChildren && formData.children > 0 ?
                    `, ${formData.children} child${formData.children > 1 ? 'ren' : ''}` : '';

    return `${circumstances}, ${housing}${children}`;
  };

  if (!isVisible) {
    return null;
  }

  const allExamples = [...PRE_LOADED_EXAMPLES, ...userExamples];

  return (
    <div className="admin-panel">
      <div className="admin-header">
        <h2>Calculation Examples</h2>
        <button
          type="button"
          className="btn btn-outline btn-sm"
          onClick={onToggleVisibility}
        >
          Close Examples
        </button>
      </div>

      <div className="admin-description">
        <p>Load pre-defined example calculations or create your own examples for future reference. Pre-loaded examples help you understand different situations.</p>
      </div>

      <div className="admin-content">
        <div className="admin-section">
          {/* Create New Example Section */}
          {currentFormData && currentResults && (
            <div className="create-example-section" style={{ marginBottom: '20px', padding: '15px', border: '1px solid #e0e0e0', borderRadius: '6px', backgroundColor: '#f9f9f9' }}>
              <h4>Create New Example</h4>
              <p>Save the current calculation as a reusable example.</p>

              {!showCreateExample ? (
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => setShowCreateExample(true)}
                >
                  Create Example from Current Calculation
                </button>
              ) : (
                <div className="create-form">
                  <div style={{ marginBottom: '10px' }}>
                    <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Example Name:</label>
                    <input
                      type="text"
                      value={exampleName}
                      onChange={(e) => setExampleName(e.target.value)}
                      placeholder="e.g., Working couple with childcare costs"
                      className="form-control"
                      style={{ width: '100%' }}
                    />
                  </div>
                  <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Description (optional):</label>
                    <textarea
                      value={exampleDescription}
                      onChange={(e) => setExampleDescription(e.target.value)}
                      placeholder="Brief description of this example..."
                      className="form-control"
                      rows="2"
                      style={{ width: '100%' }}
                    />
                  </div>
                  <div>
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={handleCreateExample}
                      disabled={!exampleName.trim()}
                      style={{ marginRight: '10px' }}
                    >
                      Save Example
                    </button>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => {
                        setShowCreateExample(false);
                        setExampleName('');
                        setExampleDescription('');
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Examples List */}
          {allExamples.length === 0 ? (
            <div className="no-examples">
              <p>No examples available.</p>
              <p>Run a calculation first, then create examples for future reference.</p>
            </div>
          ) : (
            <div className="examples-list">
              <h4>Available Examples</h4>
              {allExamples.map((example) => (
                <div key={example.id} className="example-item" style={{ marginBottom: '15px', padding: '15px', border: '1px solid #e0e0e0', borderRadius: '6px' }}>
                  <div className="example-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                    <div className="example-title">
                      {editingExample === example.id ? (
                        <div className="example-rename">
                          <input
                            type="text"
                            value={newExampleName}
                            onChange={(e) => setNewExampleName(e.target.value)}
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                handleRenameExample(example.id, newExampleName);
                              }
                            }}
                            onBlur={() => handleRenameExample(example.id, newExampleName)}
                            autoFocus
                            className="form-control form-control-sm"
                          />
                        </div>
                      ) : (
                        <h5
                          onClick={() => {
                            if (!example.isPredefined) {
                              setEditingExample(example.id);
                              setNewExampleName(example.name);
                            }
                          }}
                          style={{ cursor: example.isPredefined ? 'default' : 'pointer', margin: '0 0 5px 0' }}
                          title={example.isPredefined ? 'Pre-defined example' : 'Click to rename'}
                        >
                          {example.name} {example.isPredefined && <span style={{ fontSize: '12px', color: '#666' }}>(Built-in)</span>}
                        </h5>
                      )}
                    </div>
                    <div className="example-actions">
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => handleLoadExample(example)}
                        title="Load this example"
                        style={{ marginRight: '5px' }}
                      >
                        Load
                      </button>
                      {!example.isPredefined && (
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDeleteExample(example.id)}
                          title="Delete this example"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="example-details">
                    <p style={{ margin: '0 0 5px 0', color: '#666', fontSize: '14px' }}>{example.description}</p>
                    <div className="example-info" style={{ fontSize: '13px', color: '#888' }}>
                      <span className="example-summary">{getFormDataSummary(example.formData)}</span>
                      <span style={{ margin: '0 10px' }}>•</span>
                      <span className="example-result">{example.expectedResult}</span>
                    </div>
                    {!example.isPredefined && example.timestamp && (
                      <div className="example-timestamp" style={{ fontSize: '12px', color: '#aaa', marginTop: '5px' }}>
                        Created: {formatDateTime(example.timestamp)}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ExamplesSection;