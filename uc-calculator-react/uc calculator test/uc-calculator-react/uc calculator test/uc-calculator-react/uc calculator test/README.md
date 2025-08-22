# Universal Credit Calculator (Web Application)

A flexible, modular Universal Credit calculator web application that supports year-based rates and comprehensive calculation logic based on UK government guidelines.

## Features

- **Year-based rates**: Support for different Universal Credit rates by tax year
- **Modular design**: Separate JavaScript modules for different calculation components
- **Comprehensive calculations**: Includes all major Universal Credit elements
- **Responsive design**: Works on desktop, tablet, and mobile devices
- **Real-time calculations**: Instant updates as you change inputs
- **Local storage**: Saves user preferences and recent calculations
- **Print-friendly**: Option to print calculation results

## Project Structure

```
├── index.html                    # Main calculator interface
├── css/
│   ├── styles.css               # Main stylesheet
│   ├── components.css           # Component-specific styles
│   └── responsive.css           # Responsive design rules
├── js/
│   ├── app.js                   # Main application logic
│   ├── calculator.js            # Core calculation engine
│   ├── rates/
│   │   ├── rates-manager.js     # Year-based rates management
│   │   ├── rates-2024-25.js     # 2024/25 tax year rates
│   │   ├── rates-2023-24.js     # 2023/24 tax year rates
│   │   └── rates-base.js        # Base rates structure
│   ├── modules/
│   │   ├── standard-allowance.js # Standard allowance calculations
│   │   ├── housing-costs.js      # Housing costs element
│   │   ├── children.js           # Child elements
│   │   ├── childcare.js          # Childcare costs
│   │   ├── earnings.js           # Earnings taper calculations
│   │   └── deductions.js         # Various deductions
│   ├── utils/
│   │   ├── validators.js         # Input validation
│   │   ├── formatters.js         # Number and currency formatting
│   │   └── storage.js            # Local storage utilities
│   └── ui/
│       ├── components.js         # UI components
│       ├── events.js             # Event handlers
│       └── display.js            # Results display logic
├── assets/
│   ├── images/                   # Calculator icons and images
│   └── icons/                    # UI icons
├── docs/
│   ├── calculation-guide.md      # How calculations work
│   └── rates-reference.md        # Rate references by year
└── README.md
```

## Installation

1. Clone the repository
2. Open `index.html` in a web browser
3. No server setup required - runs entirely in the browser

## Usage

### Basic Usage
1. Open `index.html` in your web browser
2. Select the tax year
3. Fill in your personal circumstances
4. View real-time calculation results

### Features
- **Real-time calculations**: Results update automatically as you type
- **Save calculations**: Store multiple scenarios for comparison
- **Print results**: Generate a printable summary of your calculation
- **Mobile friendly**: Optimized for use on smartphones and tablets

## Calculation Components

1. **Standard Allowance**: Base amount based on age and circumstances
2. **Housing Costs**: Help with rent and service charges
3. **Child Elements**: Additional amounts for children
4. **Childcare Costs**: Help with childcare costs
5. **Earnings Taper**: Reduction based on earned income
6. **Deductions**: Various deductions (savings, other benefits, etc.)

## Rate Updates

To add a new tax year:
1. Create a new rates file in `js/rates/rates-YYYY-YY.js`
2. Update the rates manager to include the new year
3. Add the new year to the dropdown in `index.html`

## Browser Compatibility

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## Development

### Adding New Features
1. Create new JavaScript modules in appropriate directories
2. Update the main `app.js` to include new functionality
3. Add corresponding CSS styles if needed
4. Test across different browsers

### Testing
Open the browser's developer tools and check the console for any errors. The calculator includes built-in validation and error handling.

## License

MIT License
