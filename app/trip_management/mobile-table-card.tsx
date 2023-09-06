import React from 'react';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export function MobileTableCard(data: any) {
  return (
    // <Accordion type="single" collapsible>
    //   <AccordionItem value="item-1">
    //     <AccordionTrigger className='font-bold text-lg'>Trip ID: 1234</AccordionTrigger>
    //     <AccordionContent>
    //       <p>Order Filler: jsmith</p>
    //       <p>Standard Time: 0:30:00</p>
    //       <p>Completion: Completed</p>
    //       <p>Cases Picked/Total: 140/300</p>
    //     </AccordionContent>
    //   </AccordionItem>
    // </Accordion>
    <div className="card">
      <div className="font-bold text-lg">
        <h2>Trip ID: 1234</h2>
      </div>
      <div className="card-body">
        <p>Order Filler: jsmith</p>
        <p>Standard Time: 0:30:00</p>
        <p>Completion: Completed</p>
        <p>Cases Picked/Total: 140/300</p>
      </div>
    </div>
  );
}