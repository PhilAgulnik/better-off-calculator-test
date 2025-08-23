import React, { useState } from 'react';
import { UniversalCreditCalculator } from '../utils/calculator';

function TestingModule({ isVisible, onToggleVisibility }) {
  const [testFile, setTestFile] = useState(null);
  const [testResults, setTestResults] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [comparisonResults, setComparisonResults] = useState(null);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    setTestFile(file);
  };

  const processTestFile = async () => {
    if (!testFile) return;

    setIsProcessing(true);
    try {
      // Read the file
      const text = await testFile.text();
      const lines = text.split('\n');
      
      // Parse CSV/Excel data
      const testCases = parseTestData(lines);
      
      // Run calculations
      const results = await runBatchCalculations(testCases);
      
      setTestResults(results);
    } catch (error) {
      console.error('Error processing test file:', error);
      alert('Error processing test file. Please check the file format.');
    } finally {
      setIsProcessing(false);
    }
  };

  const parseTestData = (lines) => {
    // Skip header row
    const dataLines = lines.slice(1);
    
    return dataLines
      .filter(line => line.trim())
      .map((line, index) => {
        const columns = line.split(',').map(col => col.trim());
        
        // Map CSV columns to input fields
        // This mapping needs to match your spreadsheet structure
        return {
          testCaseId: index + 1,
          input: {
            taxYear: columns[0] || '2024_25',
            circumstances: columns[1] || 'single',
            age: parseInt(columns[2]) || 25,
            partnerAge: parseInt(columns[3]) || 25,
            children: parseInt(columns[4]) || 0,
            childAges: columns[5] ? columns[5].split('|').map(age => parseInt(age) || 0) : [],
            childDisabilities: columns[6] ? JSON.parse(columns[6]) : [],
            childGenders: columns[7] ? columns[7].split('|') : [],
            housingStatus: columns[8] || 'no_housing_costs',
            tenantType: columns[9] || 'private',
            rent: parseFloat(columns[10]) || 0,
            serviceCharges: parseFloat(columns[11]) || 0,
            bedrooms: parseInt(columns[12]) || 1,
            area: columns[13] || 'default',
            nonDependants: parseInt(columns[14]) || 0,
            employmentType: columns[15] || 'not_working',
            monthlyEarnings: parseFloat(columns[16]) || 0,
            childcareCosts: parseFloat(columns[17]) || 0,
            // Main person disability fields
            isDisabled: columns[18] || 'no',
            claimsDisabilityBenefits: columns[19] || 'no',
            disabilityBenefitType: columns[20] || '',
            hasLCWRA: columns[21] || 'no',
            // Partner disability fields
            partnerEmploymentType: columns[22] || 'not_working',
            partnerMonthlyEarnings: parseFloat(columns[23]) || 0,
            partnerIsDisabled: columns[24] || 'no',
            partnerClaimsDisabilityBenefits: columns[25] || 'no',
            partnerDisabilityBenefitType: columns[26] || '',
            partnerHasLCWRA: columns[27] || 'no',
            savings: parseFloat(columns[28]) || 0,
            otherBenefits: parseFloat(columns[29]) || 0,
            otherBenefitsPeriod: columns[30] || 'monthly',
            // Add more fields as needed
          },
          expectedOutput: {
            standardAllowance: parseFloat(columns[31]) || 0,
            housingElement: parseFloat(columns[32]) || 0,
            childElement: parseFloat(columns[33]) || 0,
            childcareElement: parseFloat(columns[34]) || 0,
            carerElement: parseFloat(columns[35]) || 0,
            totalElements: parseFloat(columns[36]) || 0,
            earningsReduction: parseFloat(columns[37]) || 0,
            capitalDeduction: parseFloat(columns[38]) || 0,
            benefitDeduction: parseFloat(columns[39]) || 0,
            finalAmount: parseFloat(columns[40]) || 0,
          }
        };
      });
  };

  const runBatchCalculations = async (testCases) => {
    const calculator = new UniversalCreditCalculator();
    await calculator.initialize();
    
    const results = [];
    
    for (const testCase of testCases) {
      try {
        const calculation = await calculator.calculate(testCase.input);
        const jsonOutput = calculator.exportCalculationForTesting(testCase.input, calculation);
        
        // Compare with expected results
        const comparison = compareResults(jsonOutput.output, testCase.expectedOutput);
        
        results.push({
          testCaseId: testCase.testCaseId,
          input: testCase.input,
          expectedOutput: testCase.expectedOutput,
          actualOutput: jsonOutput.output,
          comparison,
          passed: comparison.allPassed,
          errors: comparison.errors
        });
      } catch (error) {
        results.push({
          testCaseId: testCase.testCaseId,
          input: testCase.input,
          expectedOutput: testCase.expectedOutput,
          actualOutput: null,
          comparison: null,
          passed: false,
          errors: [error.message]
        });
      }
    }
    
    return results;
  };

  const compareResults = (actual, expected) => {
    const tolerance = 0.01; // £0.01 tolerance for floating point differences
    const errors = [];
    let allPassed = true;
    
    const fields = [
      'standardAllowance', 'housingElement', 'childElement', 
      'childcareElement', 'carerElement', 'totalElements',
      'earningsReduction', 'capitalDeduction', 'benefitDeduction', 'finalAmount'
    ];
    
    fields.forEach(field => {
      const actualValue = actual[field] || 0;
      const expectedValue = expected[field] || 0;
      const difference = Math.abs(actualValue - expectedValue);
      
      if (difference > tolerance) {
        errors.push({
          field,
          expected: expectedValue,
          actual: actualValue,
          difference: difference.toFixed(2)
        });
        allPassed = false;
      }
    });
    
    return { allPassed, errors };
  };

  const exportTestResults = () => {
    if (!testResults) return;
    
    const exportData = {
      testRun: {
        timestamp: new Date().toISOString(),
        totalTests: testResults.length,
        passedTests: testResults.filter(r => r.passed).length,
        failedTests: testResults.filter(r => !r.passed).length,
        successRate: ((testResults.filter(r => r.passed).length / testResults.length) * 100).toFixed(2) + '%'
      },
      results: testResults
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json'
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `uc-calculator-test-results-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!isVisible) return null;

  return (
    <section className="testing-module">
      <div className="card">
        <div className="module-header">
          <h3>Calculator Testing Module</h3>
          <button 
            type="button" 
            className="btn btn-outline btn-sm"
            onClick={onToggleVisibility}
          >
            Close
          </button>
        </div>

        <div className="module-description">
          <p>Upload a CSV file with test cases to compare your calculator results with expected outputs.</p>
        </div>

        <div className="data-entry-section">
          <div className="form-group">
            <label htmlFor="testFile">Upload Test File (CSV)</label>
            <input
              type="file"
              id="testFile"
              accept=".csv,.xlsx,.xls"
              onChange={handleFileUpload}
              className="form-control"
            />
            <small className="help-text">
              File should contain columns for input variables and expected output values.
              First row should be headers.
            </small>
          </div>

          <div className="button-group">
            <button
              type="button"
              className="btn btn-primary"
              onClick={processTestFile}
              disabled={!testFile || isProcessing}
            >
              {isProcessing ? 'Processing...' : 'Run Tests'}
            </button>
          </div>
        </div>

        {testResults && (
          <div className="test-results">
            <h4>Test Results</h4>
            
            <div className="results-summary">
              <div className="summary-stats">
                <div className="stat">
                  <span className="label">Total Tests:</span>
                  <span className="value">{testResults.length}</span>
                </div>
                <div className="stat">
                  <span className="label">Passed:</span>
                  <span className="value success">{testResults.filter(r => r.passed).length}</span>
                </div>
                <div className="stat">
                  <span className="label">Failed:</span>
                  <span className="value error">{testResults.filter(r => !r.passed).length}</span>
                </div>
                <div className="stat">
                  <span className="label">Success Rate:</span>
                  <span className="value">
                    {((testResults.filter(r => r.passed).length / testResults.length) * 100).toFixed(2)}%
                  </span>
                </div>
              </div>
            </div>

            <div className="test-details">
              <h5>Failed Tests</h5>
              {testResults.filter(r => !r.passed).map(result => (
                <div key={result.testCaseId} className="test-case failed">
                  <h6>Test Case {result.testCaseId}</h6>
                  <div className="test-errors">
                    {result.errors.map((error, index) => (
                      <div key={index} className="error-item">
                        <strong>{error.field}:</strong> Expected £{error.expected}, Got £{error.actual} (Diff: £{error.difference})
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="action-buttons">
              <button
                type="button"
                className="btn btn-outline"
                onClick={exportTestResults}
              >
                Export Results
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default TestingModule;
