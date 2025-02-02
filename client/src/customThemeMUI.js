import { createTheme } from '@mui/material';

export const customTheme = createTheme({
    // typography: {
    //     fontFamily: "'Poppins', sans-serif", // Set the custom font for material UI
    // },
    // palette: {
    //     primary: {
    //         main: '#D9DFC6', // Soft greenish-gray (Primary)
    //     },
    //     secondary: {
    //         main: '#FFF2C2', // Soft yellow (Secondary)
    //     },
    //     background: {
    //         default: '#EFF3EA', // Very light green background
    //         paper: '#FFFDF0',   // Pale cream for card/paper elements
    //     },
    //     text: {
    //         primary: '#000000', // Black text (Main text color)
    //         secondary: '#333333', // Dark gray text (Secondary text)
    //     },
    //     action: {
    //         active: '#FFF2C2',  // Soft yellow (Active elements like icons/buttons)
    //     },
    // },
    // components: {
    //     MuiButton: {
    //         styleOverrides: {
    //             root: {
    //                 backgroundColor: '#FFF2C2', // Soft yellow for buttons
    //                 color: '#000000',  // Black text on buttons
    //                 '&:hover': {
    //                     backgroundColor: '#D9DFC6', // Soft greenish-gray on hover
    //                 },
    //             },
    //         },
    //     },
    //     MuiPaper: {
    //         styleOverrides: {
    //             root: {
    //                 backgroundColor: '#FFFDF0', // Pale cream background for Paper/Card
    //                 boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)', // Subtle shadow
    //             },
    //         },
    //     },
    //     MuiAppBar: {
    //         styleOverrides: {
    //             root: {
    //                 backgroundColor: '#D9DFC6', // Soft greenish-gray AppBar
    //                 color: '#333333', // Dark gray text
    //             },
    //         },
    //     },
    // },
});



export const customTheme2 = createTheme({
  typography: {
    fontFamily: "'Poppins', sans-serif",  // Set the custom font for Material UI
  },
  palette: {
    primary: {
      main: '#fad02c',  // Yellow for the primary color
    },
    secondary: {
      main: '#14b6c2',  // Teal for the secondary color
    },
    background: {
      default: '#D0D0C4',  // Light grayish tone for general background
      paper: '#FFFFFF',  // White background for Paper/Card elements
    },
    text: {
      primary: '#393939',  // Dark gray for primary text
      secondary: '#333333',  // Slightly darker gray for secondary text
    },
    action: {
      active: '#14b6c2',  // Teal for active icons, buttons, etc.
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          backgroundColor: '#14b6c2',  // Teal for button background
          color: '#ffffff',  // White text on buttons
          '&:hover': {
            backgroundColor: '#fad02c',  // Change to yellow on hover
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: '#FFFFFF',  // White background for Paper/Card elements
          boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)',  // Soft shadow
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#fad02c',  // Yellow for AppBar
          color: '#393939',  // Dark gray text for AppBar
        },
      },
    },
  },
});

