# Universal Credit Calculator - React Version

A modern React-based Universal Credit Calculator that provides comprehensive calculations for Universal Credit entitlements.

## Features

- **Modern React Architecture**: Built with React 18 and functional components
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Real-time Calculations**: Instant updates as you change form values
- **Multiple Tax Years**: Support for 2023/24 and 2024/25 tax years
- **Scenario Management**: Save and compare different calculation scenarios
- **Export Functionality**: Export calculations as JSON files
- **Print Support**: Print-friendly results

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### Building for Production

```bash
npm run build
```

This creates a `build` folder with the production-ready files.

## Project Structure

```
src/
├── components/          # React components
│   ├── CalculatorForm.js
│   ├── ResultsSection.js
│   ├── SavedScenarios.js
│   └── LoadingOverlay.js
├── utils/              # Utility functions
│   ├── calculator.js   # Main calculation logic
│   └── formatters.js   # Formatting utilities
├── App.js              # Main application component
├── index.js            # Application entry point
└── index.css           # Global styles
```

## Key Components

### CalculatorForm
The main form component that handles all user input for:
- Personal details (age, circumstances, children)
- Housing information (rent, tenant type, bedrooms)
- Employment details (earnings, employment type)
- Carer status
- Other benefits and savings

### ResultsSection
Displays calculation results including:
- Final Universal Credit amount
- Detailed breakdown of all elements
- Print and export functionality

### SavedScenarios
Manages saved calculation scenarios:
- Save current calculations with custom names
- Load previously saved scenarios
- Delete unwanted scenarios

## Calculation Features

The calculator includes calculations for:

- **Standard Allowance**: Based on age and circumstances
- **Housing Element**: Rent and service charges
- **Child Element**: Support for children
- **Childcare Element**: 85% of childcare costs
- **Carer Element**: Additional support for carers
- **Earnings Reduction**: 55% taper rate on earnings over work allowance
- **Capital Deduction**: Based on savings levels
- **Benefit Deduction**: Other benefits received

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Development

### Available Scripts

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm run eject` - Ejects from Create React App (one-way operation)

### Code Style

The project uses:
- Functional components with hooks
- ES6+ JavaScript features
- CSS custom properties for theming
- Responsive design principles

## Issues and Limitations

### Current Limitations

1. **Simplified Calculations**: This React version uses simplified calculation logic compared to the full JavaScript version
2. **Limited Tax Years**: Currently supports only 2023/24 and 2024/25
3. **Basic Housing Calculations**: LHA rates are simplified
4. **No Self-employed Details**: Self-employed calculations are basic

### Known Issues

1. **Missing JavaScript Files**: The original project has several missing JavaScript modules that would need to be implemented
2. **Rate Updates**: Tax year rates are hardcoded and would need manual updates
3. **Validation**: Form validation is basic and could be enhanced

### Future Enhancements

1. **Full Calculation Engine**: Implement the complete calculation logic from the original JavaScript version
2. **API Integration**: Connect to external APIs for up-to-date rates
3. **Advanced Validation**: Add comprehensive form validation
4. **Accessibility**: Improve accessibility features
5. **Testing**: Add comprehensive unit and integration tests
6. **Internationalization**: Support for multiple languages
7. **Progressive Web App**: Add PWA features

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is for educational and guidance purposes only. It should not be considered as official advice for Universal Credit claims.

## Disclaimer

This calculator is for guidance only and should not be considered as official advice. For official Universal Credit information, visit [gov.uk/universal-credit](https://www.gov.uk/universal-credit).
