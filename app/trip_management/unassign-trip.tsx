import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useToast } from "@/components/ui/use-toast";

import { mutate } from 'swr'

async function unassignTrip(tripID: string) {
  try {
    const response = await fetch('/api/unassign_trip', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ trip_id: tripID }),
    });

    if (response.ok) {
      const jsonData = await response.json();
      // console.log(jsonData);
      return jsonData;
    } else {
      console.error('Request failed with status:', response.status);
    }
  } catch (error) {
    console.error('Error sending POST request:', error);
  }
}

export default function UnassignTripDialog({ tripID, casesPicked }: { tripID: string, casesPicked: number }) {
  const { toast } = useToast()

  const handleUpdateData = async () => {
    const parseDate = (date: string) => String(new Date(date).toISOString().replace("T", " ").replace(/\.\d+/, "").split(" ")[0]);

    let tripInfo = await unassignTrip(tripID)
    mutate([ '/api/trips', parseDate(tripInfo.date) ])

    toast({
      title: "Confirmed",
      description: `Trip ${tripID} has been unassigned.`,
    })
  };

  return (    
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Unassign Trip</DialogTitle>
        <DialogDescription>
          {casesPicked > 0 ? (
            <>
              This trip has already been started. Only trips that have not had any cases picked can be unassigned.
            </>
          ) : (
            <>
              Are you sure you want to unassign this trip?
            </>
          )}
        </DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <DialogTrigger>
          {casesPicked > 0 ? 
            <Button type="submit">OK</Button>
          :
            <Button type="submit" onClick={handleUpdateData}>Confirm</Button>
          }
        </DialogTrigger>
      </DialogFooter>
    </DialogContent>
  )
}