export default {
    theme: {
     colors: {
     transparent: 'transparent',
     primary: {
       100:"#6d8e94",
       200:"#D0DBDD",
       300:"#9BB2B7",
       400:"#4A757D",
       500:"#2E5F68",
     },
     secondary1: {
       100:"#F1DDAF",
       200:"#FFFBF0",
       300:"#FFF3D8",
       400:"#CCB377",
       500:"#A98C48",
     },
     secondary2: {
       100:"#F1B2AF",
       200:"#FFF1F0",
       300:"#FFDAD8",
       400:"#CC7B77",
       500:"#A94D48",
     },
     darkgray: "#404040",
     gray: "#808080",
     lightgray: "#D0D0D0",
     white: '#FFF'
   },
   overflow: {
     'overlay': 'overlay'
   },
   extend: {
     keyframes: {
       'fade-in': {
         '0%': {opacity: 0, visibility: 'hidden'},
         '50%': {opacity: 0.5, visibility: 'visible'},
         '100%': {opacity: 1, visibility: 'visible'},
       },
       'fade-out': {
         '0%': {opacity: 1, visibility: 'visible'},
         '50%': {opacity: 0.5, visibility: 'visible'},
         '100%': {opacity: 0, visibility: 'hidden'},
       },
       'slide-in': {
         '0%': {opacity: 0, transform: 'translateY(50%)'},
         '50%': {opacity: 0.5, transform: 'translateY(25%)'},
         '100%': {opacity: 1, transform: 'translateY(0)' },
       }
     },
     animation: {
       'fade-in': 'fade-in 0.1s ease-in-out 1',
       'fade-out': 'fade-out 0.1s ease-in-out 1',
       'slide-in': 'slide-in 0.3s ease-in-out 1',
     },
     transitionProperty: {
       'outline': 'outline',
       'width': 'width',
       'left': 'left',
       'height': 'height',
       'stroke': 'stroke, stroke-width',
       'fill': 'fill',
       'transform': 'transform',
       'slide-in': 'opacity,transform',
     },
   },
 },
};
