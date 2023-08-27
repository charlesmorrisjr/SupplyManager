// @ts-nocheck
import Shepherd from "shepherd.js";

export const tour = new Shepherd.Tour({
  useModalOverlay: false,
  defaultStepOptions: {
    cancelIcon: {
      enabled: true
    },
    classes: 'shadow-md bg-purple-dark',
    scrollTo: false
  },
});

export default function initializeTour() {  
  tour.addSteps([
    {
      id: 'initial-step',
      title: 'Order Filler Details',
      text: 'On this page, you can view information about each order filler, such as their current performance and what trips they have worked on.',
      classes: '',
      buttons: [
        {
          text: 'Exit',
          secondary: true,
          action: tour.complete
        },
        {
          text: 'Next',
          action: tour.next
        }
      ]
    },
    {
      id: 'employee-combobox-step',
      title: 'Order Filler Details',
      text: 'To begin, select an employee from the dropdown menu.',
      attachTo: {
        element: '.employee-combobox',
        on: 'top'
      },
      classes: '',
      buttons: [
        {
          text: 'Exit',
          secondary: true,
          action: tour.complete
        },
        // {
        //   text: 'Next',
        //   action: tour.next
        // }
      ]
    },
    {
      id: 'performance-chart-step',
      title: 'Order Filler Details',
      text: "Once you've selected an employee, you can view their performance on this graph.",
      attachTo: {
        element: '.performance-chart',
        on: 'top'
      },
      classes: '',
      buttons: [
        {
          text: 'Exit',
          secondary: true,
          action: tour.complete
        },
        {
          text: 'Next',
          action: tour.next
        }
      ]
    },
    {
      id: 'table-container-step',
      title: 'Order Filler Details',
      text: "You can also view the trips that the employee has worked on in this table.",
      attachTo: {
        element: '.table-container',
        on: 'top'
      },
      classes: '',
      buttons: [
        {
          text: 'Exit',
          secondary: true,
          action: tour.complete
        },
        {
          text: 'Next',
          action: tour.next,
          scrollTo: true
        }
      ]
    },
    {
      id: 'dropdown-button-step',
      title: 'Order Filler Details',
      text: "These menus will let you see the items on each trip, as well as unassign trips that have not been started yet.",
      attachTo: {
        element: '.dropdown-button',
        on: 'top'
      },
      classes: '',
      buttons: [
        {
          text: 'Exit',
          secondary: true,
          action: tour.complete
        },
      ],
    }
  ]);
}